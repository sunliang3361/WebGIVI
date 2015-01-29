# webGIVI
# implemention
1. Change mode of folder usrID
Give full permission to this folder
e.g. chmod 777 usrID
2. crontab usrID
Empty folder usrID every week or every day depends on the visiting amount.
for example , 0 0 * * * /usr/bin/php  /PATHTOYOURDIRECTORY/delete_cron_webgivi.php
this command will empty usrID every day at 12am.
