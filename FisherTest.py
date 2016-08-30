#!/usr/bin/env python

import sys
import re
import scipy.stats

back_terms=dict()
back_genes=0
generated_terms=dict()
generated_genes=0

## command line arguments
# taking the bionex filename
narg = len(sys.argv)
if narg<4:
	print "...failed! enter background_file, generated_file, output_filename"
	sys.exit()
else:
	background_file=sys.argv[1]
	generated_file=sys.argv[2]
	fisher_value_file=sys.argv[3]


def loadBackground():
	global back_terms
	global back_genes
	genes=dict()

	fh=open(background_file, "r")	
	for line in fh:
		if line.strip()!='':			
			gene =line.split('\t')[0].strip()
			term =line.split('\t')[1].strip()
			if back_terms.has_key(term):
				back_terms[term]=back_terms[term]+1
			else:
				back_terms[term]=1
			genes[gene]=gene

	fh.close()
	back_genes=len(genes)
	#print "Terms in background set: "+str(len(back_terms))
	#print "Genes in background set: "+str(len(genes))
	
	'''
	for k in back_terms.keys():
		if back_terms[k]>50:
			print k, back_terms[k]
	'''

def loadGenerated():
	global generated_terms
	global generated_genes
	genes=dict()

	#generated_file="data/id_1452818557_90d53fd484242ffe7fba8c6aff7a9260_gene_iterm.txt"
	fh=open(generated_file, "r")	
	for line in fh:
		if line.strip()!='':			
			gene =line.split('\t')[0].strip()
			term =line.split('\t')[1].strip()
			if generated_terms.has_key(term):
				generated_terms[term]=generated_terms[term]+1
			else:
				generated_terms[term]=1
			genes[gene]=gene

	fh.close()
	generated_genes=len(genes)
	#print "Terms in generated set: "+str(len(generated_terms))
	#print "Genes in generated set: "+str(len(genes))

	'''
	for k in generated_terms.keys():
		if generated_terms[k]>0:
			print k, generated_terms[k]
	'''
	

def FisherExactTest():
	global back_terms
	global back_genes
	global generated_terms
	global generated_genes
	global fisher_value_file

	outlines=list()

	

	for t in generated_terms.keys():
		a=0
		b=0
		c=0
		d=0
		in_generated=0
		if generated_terms.has_key(t):
			a+=generated_terms[t]
			in_generated=generated_terms[t]

		in_background=0
		if back_terms.has_key(t):
			b+=back_terms[t]
			in_background=back_terms[t]

		c+= (generated_genes-in_generated)
		d+= (back_genes-in_background)
		#break

		#print a
		#print b
		#print c
		#print d
		#pvalue=0.000008234798237
		oddsratio, pvalue = scipy.stats.fisher_exact([[a, b], [c, d]])
		#print t+'\t'+str(pvalue)
		outlines.append(t+'\t'+str(pvalue))
		#print '0.000008234798237'
		#print generated_file
		

	fh=open(fisher_value_file, "w")
	for line in outlines:
		fh.write(line+'\n')	
	fh.close()



if __name__ == '__main__':

	loadBackground()
	loadGenerated()
	FisherExactTest()


