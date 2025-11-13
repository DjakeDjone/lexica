#!/usr/bin/env bash

set -euo pipefail

usage() {
	cat <<'EOF'
Usage: ldap_ssl_script.sh [OPTIONS] <server-name>

Automates the LDAPS v7 setup procedure described in LDAPSv7.pdf.

Options:
	--ca-dir <path>     Directory to initialise the Easy-RSA CA in (default: /root/myca)
	--ldif <path>       Path to write the temporary LDIF file (default: /tmp/certs.ldif)
	-h, --help          Show this help message and exit

Environment variables:
	CA_DIR      Overrides the default CA directory.
	LDIF_FILE   Overrides the default LDIF file path.

Example:
	sudo ./ldap_ssl_script.sh ldap01
EOF
}

require_root() {
	if [[ $(id -u) -ne 0 ]]; then
		echo "[ERROR] This script must be run as root." >&2
		exit 1
	fi
}

log() {
	echo "[INFO] $*"
}

warn() {
	echo "[WARN] $*" >&2
}

append_once() {
	local file="$1"
	local line="$2"
	if [[ ! -f "$file" ]]; then
		echo "$line" >"$file"
		return
	fi
	if ! grep -Fxq "$line" "$file"; then
		echo "$line" >>"$file"
	fi
}

main() {
	require_root

	local ca_dir="${CA_DIR:-/root/myca}"
	local ldif_file="${LDIF_FILE:-/tmp/certs.ldif}"
	local server_name=""

	while [[ $# -gt 0 ]]; do
		case "$1" in
			--ca-dir)
				[[ $# -ge 2 ]] || { echo "[ERROR] Missing value for --ca-dir" >&2; exit 1; }
				ca_dir="$2"
				shift 2
				;;
			--ldif)
				[[ $# -ge 2 ]] || { echo "[ERROR] Missing value for --ldif" >&2; exit 1; }
				ldif_file="$2"
				shift 2
				;;
			-h|--help)
				usage
				return
				;;
			--)
				shift
				break
				;;
			-*)
				echo "[ERROR] Unknown option: $1" >&2
				exit 1
				;;
			*)
				if [[ -z "$server_name" ]]; then
					server_name="$1"
					shift
				else
					echo "[ERROR] Unexpected argument: $1" >&2
					exit 1
				fi
				;;
		esac
	done

	if [[ -z "$server_name" ]]; then
		usage >&2
		exit 1
	fi

	install_packages
	prepare_ca "$ca_dir"
	build_certificates "$ca_dir" "$server_name"
	deploy_certificates "$ca_dir" "$server_name"
	configure_permissions "$server_name"
	disable_apparmor_for_slapd
	create_ldif "$ldif_file" "$server_name"
	apply_ldif "$ldif_file"
	configure_slapd_services
	restart_slapd

	log "LDAPS setup steps finished. Import /etc/ssl/certs/ca.crt into your LDAP client (e.g. JXplorer) and connect via LDAPS on port 636."
}

install_packages() {
	log "Installing required packages (easy-rsa, apparmor-utils, ldap-utils)..."
	export DEBIAN_FRONTEND=noninteractive
	apt-get update -qq
	apt-get install -y easy-rsa apparmor-utils ldap-utils >/dev/null
}

prepare_ca() {
	local ca_dir="$1"
	local parent_dir
	parent_dir=$(dirname "$ca_dir")
	mkdir -p "$parent_dir"

	if [[ ! -d "$ca_dir" ]]; then
		log "Initialising Easy-RSA CA directory at $ca_dir"
		make-cadir "$ca_dir"
	else
		log "CA directory $ca_dir already exists; skipping make-cadir"
	fi
}

build_certificates() {
	local ca_dir="$1"
	local server_name="$2"
	local ca_cert="$ca_dir/pki/ca.crt"
	local server_cert="$ca_dir/pki/issued/${server_name}.crt"

	pushd "$ca_dir" >/dev/null
	export EASYRSA_BATCH=1

	if [[ ! -d "$ca_dir/pki" ]]; then
		log "Initialising PKI"
		./easyrsa init-pki
	fi

	if [[ ! -f "$ca_cert" ]]; then
		log "Building new certificate authority"
		./easyrsa build-ca nopass
	else
		log "CA certificate already exists at $ca_cert; skipping build-ca"
	fi

	if [[ ! -f "$server_cert" ]]; then
		log "Generating server certificate for $server_name"
		./easyrsa build-server-full "$server_name" nopass
	else
		log "Server certificate $server_cert already exists; skipping build-server-full"
	fi

	popd >/dev/null
}

deploy_certificates() {
	local ca_dir="$1"
	local server_name="$2"
	local ca_cert_src="$ca_dir/pki/ca.crt"
	local server_cert_src="$ca_dir/pki/issued/${server_name}.crt"
	local server_key_src="$ca_dir/pki/private/${server_name}.key"

	local cert_dst="/etc/ssl/certs/${server_name}.crt"
	local key_dst="/etc/ssl/private/${server_name}.key"
	local ca_dst="/etc/ssl/certs/ca.crt"

	log "Deploying certificates to /etc/ssl"
	install -o root -g root -m 644 "$ca_cert_src" "$ca_dst"
	install -o root -g root -m 644 "$server_cert_src" "$cert_dst"
	install -o root -g root -m 640 "$server_key_src" "$key_dst"
}

configure_permissions() {
	local server_name="$1"
	local key_dst="/etc/ssl/private/${server_name}.key"
	local cert_dst="/etc/ssl/certs/${server_name}.crt"
	local ca_dst="/etc/ssl/certs/ca.crt"

	log "Configuring certificate permissions"

	if ! getent group ssl-cert >/dev/null; then
		log "Creating ssl-cert group"
		addgroup --system ssl-cert >/dev/null
	fi

	if id -u openldap >/dev/null 2>&1; then
		gpasswd -a openldap ssl-cert >/dev/null
	else
		warn "User 'openldap' not found; skip adding to ssl-cert group. Ensure slapd is installed."
	fi

	chgrp ssl-cert /etc/ssl/private
	chmod g+rx /etc/ssl/private

	chgrp ssl-cert "$key_dst"
	chmod 640 "$key_dst"

	chmod 644 "$cert_dst" "$ca_dst"
}

disable_apparmor_for_slapd() {
	if ! command -v aa-status >/dev/null; then
		warn "aa-status not available; skipping AppArmor adjustments"
		return
	fi

	if aa-status 2>/dev/null | grep -q 'profiles are in enforce mode' && aa-status 2>/dev/null | grep -q 'slapd'; then
		log "Disabling AppArmor profile for slapd"
		mkdir -p /etc/apparmor.d/disable
		ln -sf /etc/apparmor.d/usr.sbin.slapd /etc/apparmor.d/disable/usr.sbin.slapd
		if command -v apparmor_parser >/dev/null; then
			apparmor_parser -R /etc/apparmor.d/disable/usr.sbin.slapd || warn "Failed to remove AppArmor profile for slapd"
		else
			warn "apparmor_parser not available; the profile might still be active"
		fi
	else
		log "AppArmor does not enforce slapd; skipping"
	fi
}

create_ldif() {
	local ldif_file="$1"
	local server_name="$2"

	log "Writing LDIF configuration to $ldif_file"
	cat >"$ldif_file" <<EOF
dn: cn=config
changetype: modify
replace: olcTLSCACertificateFile
olcTLSCACertificateFile: /etc/ssl/certs/ca.crt
-
add: olcTLSVerifyClient
olcTLSVerifyClient: never
-
replace: olcTLSCertificateKeyFile
olcTLSCertificateKeyFile: /etc/ssl/private/${server_name}.key
-
replace: olcTLSCertificateFile
olcTLSCertificateFile: /etc/ssl/certs/${server_name}.crt
EOF
}

apply_ldif() {
	local ldif_file="$1"
	log "Applying LDIF with ldapadd"
	systemctl restart slapd
	ldapadd -Y EXTERNAL -H ldapi:/// -f "$ldif_file"
}

configure_slapd_services() {
	local defaults_file="/etc/default/slapd"
	local desired='SLAPD_SERVICES="ldap:/// ldaps:/// ldapi:///"'

	if [[ ! -f "$defaults_file" ]]; then
		warn "$defaults_file not found; skipping SLAPD_SERVICES update"
		return
	fi

	if [[ ! -f "${defaults_file}.bak" ]]; then
		cp "$defaults_file" "${defaults_file}.bak"
	fi

	if grep -q '^SLAPD_SERVICES=' "$defaults_file"; then
		log "Updating SLAPD_SERVICES in $defaults_file"
		sed -i -E "s|^SLAPD_SERVICES=.*|$desired|" "$defaults_file"
	else
		log "Adding SLAPD_SERVICES definition to $defaults_file"
		append_once "$defaults_file" "$desired"
	fi
}

restart_slapd() {
	log "Restarting slapd"
	systemctl restart slapd
	systemctl status slapd --no-pager -l | sed -n '1,5p'
}

main "$@"
