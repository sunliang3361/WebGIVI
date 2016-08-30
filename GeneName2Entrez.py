#!/usr/bin/env python

import sys
import MySQLdb
import re


dbuser='mahmood'
dbpass='password'


db = MySQLdb.connect("localhost",dbuser,dbpass,"EntrezGeneNew")
cursor = db.cursor()

# parameter
if len(sys.argv)>1:
	genesymbols = sys.argv[1]
else:
	sys.exit(2)

if genesymbols.strip()=='':
	sys.exit(2)	

genes = genesymbols.split()
genestring=""
for gene in genes:
	genestring+="""'"""+gene+"""',"""
genestring = re.sub(r',$','',genestring,re.M)

sql = """SELECT gene_id FROM gene_info WHERE symbol in ("""+genestring+""")"""
           
cursor.execute(sql)
results = cursor.fetchall()    

retString = ''
for row in results:
	retString +=str(row[0])+'\n'

# disconnect from server
db.close()
print retString