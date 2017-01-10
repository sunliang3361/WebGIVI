#!/usr/bin/env python

import sys
import re
import scipy.stats
import MySQLdb
import urllib2


## command line arguments
# taking the bionex filename
narg = len(sys.argv)
if narg<2:
	print "Arg missing."
	sys.exit()
else:
	filepass=sys.argv[1]

input_genes=dict()
gene_symbols=dict()


amigo_file=filepass+'.txt'
outfile=filepass+'_gene_iterm.txt'
outfile_ORG=filepass+'_gene_iterm_original.txt'
outfile_modified=filepass+'_gene_iterm_modified.txt'
outfile_fisher=filepass+'_gene_iterm_fisher.txt'


def prepareFiles():

	global gene_symbols

	pval_dict=dict()
	fw = open(outfile, 'w')
	fh = open(amigo_file, 'r')
	for line in fh:
		if line.strip()!='':
			ps=line.split('\t')
			gene=ps[0]
			term=ps[1]
			category=ps[2]
			pval=float(ps[3])

			if gene_symbols.has_key(gene):
				line1=gene_symbols[gene]+'\t'+term+'\t'+category
				pval_dict[term]=pval
				fw.write(line1+'\n')

	fh.close()
	fw.close()

	fw1 = open(outfile_fisher, 'w')
	for key in pval_dict.keys():
		fw1.write(key+'\t'+str(pval_dict[key])+'\n')
	fw1.close()


def loadGenes():
	global input_genes
	fh = open(amigo_file, 'r')
	for line in fh:
		if line.strip()!='':
			ps=line.split('\t')
			input_genes[ps[0]]=ps[0]
	fh.close()
	#print len(input_genes)


def convert2symbols():
	global input_genes
	global gene_symbols

	for entrezid in input_genes.keys():
		req = urllib2.Request('http://biotm.cis.udel.edu/eGIFT_APIs/form/forms/form_gene_names.php?id='+entrezid+'&id_type=entrez&name_type=official_short')
		response = urllib2.urlopen(req)
		the_page = response.read()
		geneSymbol = re.sub(r'(<.*?>)|(</.*?>)','',the_page).strip()
		gene_symbols[entrezid]=geneSymbol
	
	#print len(gene_symbols)	


if __name__ == '__main__':
	#GeneSymbol()
	loadGenes()
	#GeneSymbol()
	convert2symbols()
	prepareFiles()

	



