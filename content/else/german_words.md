# Daily Reminder

this script notifies you daily with a reminder message.

## Download Script

::download-link
---
link: /scripts/daily_reminder.sh
---
Daily Reminder Script herunterladen
::

### Usage

Make the script executable:

```bash
chmod +x daily_reminder.sh
```

place a file with your reminder message next to it and call it `german_words.txt` or just pass the file name as first argument:

the files format like this example:

```txt
ambivalent:zwiespältig::Man hat ambivalente Gefühle, wenn man sich nicht entscheiden kann.
antizipieren:vorwegnehmen::Ein Schachspieler muss die Züge des Gegners antizipieren.
apathisch:teilnahmslos::Er saß apathisch auf dem Sofa und starrte vor sich hin.
archaisch:altertümlich::Die Bräuche in diesem Dorf wirken auf Außenstehende oft archaisch.
autark:unabhängig::Das Haus ist dank Solaranlage energetisch autark.
authentisch:echt, glaubwürdig::Seine Freude wirkte absolut authentisch.
banal:alltäglich, gehaltlos::Das ist eine banale Feststellung, die niemanden überrascht.
bilateral:zweiseitig::Die beiden Länder führten bilaterale Gespräche.
```

then run the script:

```bash
./daily_reminder.sh
```

The script will read a random line from the file and display it as a notification using `notify-send`.

You can subscribe to this messages on your phone by installing the app: <https://docs.ntfy.sh>
and subscribing to the topic `daily_german_word`.

> ## Note
> 
> To make sure the script doesn't shutdown when you log out of your server, you can run it with `screen` or `tmux`:
>
> ```bash
> screen -S daily_reminder ./daily_reminder.sh
> ```
>