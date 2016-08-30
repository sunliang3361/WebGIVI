#!/usr/bin/env python

"""
Script to map one set of IDs into another, using uniprot's ID mapping service

USAGE:
python convertIDs.py --ctype <convertion_type> --ids "<ids>"
or
python convertIDs.py -c <convertion_type> -i "<ids>"

INPUTS:
<convertion_type> =
		"u2e" for uniprot to entrez
		"b2u" for ensemble to uniprot
		"e2u" for entrez to uniprot

<ids> = comma-separated list of IDS. If more than one, use quote signs.

OUTPUT:
converted IDs, one per line

EXAMPLE:
python convertIDs.py -c u2e -i "P79774 F1NWK5 Q8AYE5 E1BUS7 Q8JG64 Q9PVY0 Q9IA05 Q9DDT7"

"""

import getopt
import sys
import urllib,urllib2

convert_type=''
input_ids=''


# load the command line argument
def loadCmdArgs():
	global convert_type
	global input_ids
	
	try:
		opts, args = getopt.getopt(sys.argv[1:], "c:i:", ["ctype=","ids="])
	except getopt.GetoptError:
		print 'Error'
		sys.exit(2)

	for o, a in opts:
		if o in ("-c", "--ctype"):
			convert_type = a
		elif o in ("-i", "--ids"):
			input_ids = a
		else:
			print 'Error'
			sys.exit(2)

	if input_ids.strip() == '' or convert_type.strip() == '':
		print 'Error'
		sys.exit(2)


# calls uniprots API to retrieve converted IDs
def convert():
	global convert_type
	global input_ids

	ID_abbr={'entrez':'P_ENTREZGENEID', 'uniprot':'ACC', 'ensemble':'ENSEMBL_ID'}

	id_from=''
	id_to=''
	if convert_type=='u2e':
		id_from=ID_abbr['uniprot']
		id_to=ID_abbr['entrez']
	elif convert_type=='e2u':
		id_from=ID_abbr['entrez']
		id_to=ID_abbr['uniprot']
	elif convert_type=='b2u':
		id_from=ID_abbr['ensemble']
		id_to=ID_abbr['uniprot']
	
	url = 'http://www.uniprot.org/mapping/'

	params = {
	'from':id_from,
	'to':id_to,
	'format':'tab',
	'query':input_ids
	}

	data = urllib.urlencode(params)
	request = urllib2.Request(url, data)
	contact = "" # Please set your email address here to help us debug in case of problems.
	request.add_header('User-Agent', 'Python %s' % contact)
	response = urllib2.urlopen(request)
	page = response.read(200000)

	retString = ''
	lines = page.split('\n')
	for line in lines:
		if line.strip()!='' and not line.startswith('From'):
			retString +=line.strip().split('\t')[1]+'\n'
			
	print retString	


if __name__ == '__main__':
	
	loadCmdArgs()
	convert()

