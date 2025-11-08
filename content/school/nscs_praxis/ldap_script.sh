#! /usr/bin/bash

echo "Starting LDAP setup script..."

# need file path input
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <ldif_file_path>"
    exit 1
fi

LDIF_FILE="$1"

# creates a file for each line in the csv
while IFS= read -r line; do
    IFS=';' read -r class id surname firstname email <<< "$line"
    cat > "${id}.ldif" << EOF
dn: cn=${firstname} ${surname}, ou=users, o=if, dc=friedl,dc=lan
objectclass: top
objectclass: person
objectclass: organizationalPerson
objectclass: inetOrgPerson
objectclass: posixAccount
cn: ${firstname} ${surname}
displayName: ${firstname} ${surname}
sn: ${surname}
givenName: ${firstname}
initials: ${firstname:0:1}${surname:0:1}
title: Dr
uid: ${id}
mail: ${email}
roomNumber: N326
uidNumber: 5000
gidNumber: 5000
homeDirectory: /home/${id}
userPassword: {SSHA}xxx
loginShell: /bin/bash
EOF
done < "$LDIF_FILE"
echo "LDIF files created successfully."