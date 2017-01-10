#!/usr/bin/env python

import sys
import re
import MySQLdb


## command line arguments
# taking the bionex filename
narg = len(sys.argv)
if narg<4:
	print "...failed! enter Lrange, Urange, yes/no"
	sys.exit()
else:
	lrange=int(sys.argv[1])
	urange=int(sys.argv[2])
	show = sys.argv[3]


dbuser='mahmood'
dbpass='password'



def doTheThing():

	global dbuser
	global dbpass

	totalCount=0

	# Open database connection
	db = MySQLdb.connect("localhost",dbuser,dbpass,"UDIDGenes" )

	# prepare a cursor object using cursor() method
	cursor = db.cursor()


	# Prepare SQL query to into the database.
	# select udid, count(*) from eGRABPmids where About=1.00 group by udid having count(*)>50 and count(*)<1000;
	sql = "SELECT UDID, count(*) FROM eGRABPmids WHERE About=1.00 group by UDID HAVING count(*)>=%d and count(*)<=%d" % (lrange, urange)
	
	try:
		# Execute the SQL command
		cursor.execute(sql)			
		# Fetch all the rows in a list of lists.
		# rowN = cursor.rowcount
		results = cursor.fetchall()
		for row in results:				
			udid = row[0]
			count = row[1]
			totalCount+=1
			genename=''
			sql1 = "SELECT ShortName FROM UDGenes WHERE UDID=%d" % udid
			cursor.execute(sql1)
			results1 = cursor.fetchall()
			for row1 in results1:
				genename=row1[0]

			if show=='yes':
				print str(udid)+'\t'+genename+'\t'+str(count)

	except:
		print "Error: unable to fecth data"
		

	# disconnect from server
	db.close()
	print "Fetched: "+str(totalCount)


if __name__ == '__main__':
	doTheThing()
