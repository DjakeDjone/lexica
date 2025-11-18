# Distro Hopping

Um besser OS zu wechseln habe ich ein Script geschriben, welches alle Files im Home ordner zipt und alle GIT repos in einem Textfile speichert, damit man diese später wieder klonen kann.

## Download Script

<!-- [script](/scripts/distro-hopping.sh) -->
::download-link
---
link: /scripts/distro-hopping.sh
---
Distro Hopping Script herunterladen
::

## Usage

1. Download the script from the link above.
2. Make the script executable:
   ```bash
   chmod +x distro-hopping.sh
   ```
3. Run the script:
   ```bash
   ./distro-hopping.sh
   ```
4. The script will create a zip file containing your home directory files (excluding certain directories) and a text file with the list of your GIT repositories.
5. Transfer the zip file and the GIT repositories list to your new OS.
6. Unzip the zip file in your home directory on the new OS.
7. Use the GIT repositories list to clone your repositories: