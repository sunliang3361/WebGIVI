#!/usr/bin/env python

import sys
import re
import MySQLdb


## command line arguments
# taking the bionex filename
narg = len(sys.argv)
if narg<3:
	print "...failed! enter Lrange, Urange"
	sys.exit()
else:
	lrange=int(sys.argv[1])
	urange=int(sys.argv[2])



dbuser='mahmood'
dbpass='password'
udids=list()
udid2tids=list()
udid2iterms=list()
udid2genename=dict()


def ListUDIDs():
	global dbuser
	global dbpass
	global udids
	global udid2genename

	# Open database connection
	db = MySQLdb.connect("localhost",dbuser,dbpass,"UDIDGenes" )

	# prepare a cursor object using cursor() method
	cursor = db.cursor()

	sql = "SELECT UDID, count(*) FROM eGRABPmids WHERE About=1.00 group by UDID HAVING count(*)>=%d and count(*)<=%d" % (lrange, urange)
	
	try:
		# Execute the SQL command
		cursor.execute(sql)			
		# Fetch all the rows in a list of lists.
		# rowN = cursor.rowcount
		results = cursor.fetchall()
		for row in results:				
			udid = row[0]
			udids.append(udid)
			genename=''
			sql1 = "SELECT ShortName FROM UDGenes WHERE UDID=%d" % udid
			cursor.execute(sql1)
			results1 = cursor.fetchall()
			for row1 in results1:
				genename=row1[0]
				udid2genename[udid]=genename
	except:
		print "Error: unable to fecth data"
		

	# disconnect from server
	db.close()
	#print "Fetched: "+str(len(udids))



def ListGenetoTIDs():
	global udids
	global udid2tids

	# Open database connection
	db = MySQLdb.connect("localhost",dbuser,dbpass,"iTerms" )

	# prepare a cursor object using cursor() method
	cursor = db.cursor()

	for udid in udids:

		sql = "SELECT TID FROM gene2iTerms WHERE UDID=%d and rank<201" % (int(udid))
		#print sql
		
		try:
			# Execute the SQL command
			cursor.execute(sql)			
			# Fetch all the rows in a list of lists.
			rowN = cursor.rowcount
			#print rowN
			results = cursor.fetchall()
			for row in results:				
				tid = row[0]
				#print tid
				udid2tids.append(str(udid)+'\t'+str(tid))
				#udid2tids.append(udid+'\t'+str(tid))
				#print str(udid)+'\t'+str(tid)
		except:
			print "Error: unable to fecth data"
			sys.exit(2)


	# disconnect from server
	db.close()
	#print "Fetched: "+str(len(udid2tids))


def ListGenetoiTerms():
	global udids
	global udid2tids
	global udid2iterms
	global udid2genename

	# Open database connection
	db = MySQLdb.connect("localhost",dbuser,dbpass,"iTerms" )

	# prepare a cursor object using cursor() method
	cursor = db.cursor()

	for pair in udid2tids:

		udid = int(pair.split('\t')[0]) 
		TID = int(pair.split('\t')[1])

		sql = "SELECT term FROM terms WHERE TID=%d" % (int(TID))
		#print sql
		
		try:
			# Execute the SQL command
			cursor.execute(sql)			
			# Fetch all the rows in a list of lists.
			#rowN = cursor.rowcount
			#print rowN
			results = cursor.fetchall()
			for row in results:				
				term = re.sub(r'~#~',' ',row[0],re.M)				
				udid2iterms.append(str(udid)+'\t'+term)				
				print udid2genename[udid].upper()+'\t'+(term)
		except:
			print "Error: unable to fecth data"
			sys.exit(2)


	# disconnect from server
	db.close()
	#print "Fetched: "+str(len(udid2iterms))

if __name__ == '__main__':

	ListUDIDs()
	ListGenetoTIDs()
	ListGenetoiTerms()
