#remove "species","technique",cell (type/line)
#!/usr/bin/perl
if ($#ARGV > -1)                   
{	$file = $ARGV[0];
}
my @black;
 open(BLACK,'<blacklist.txt') or die;
 @fasta=<BLACK>;
 close(BLACK);
 foreach $fasta (@fasta) {
  # chomp($fasta);
  $fasta=~s/\R//;
  if($fasta=~m/--/){
    $fasta=~m/(.*)[\s+]--/;
    $fasta=$1;
    push (@black,$fasta);
  }
  else{
    push (@black,$fasta);
  }
 }
 my $file_egift=$file.'.txt';
 #print $file_egift."\n";
 open(FASTA,"<$file_egift") or die ("can not open");
 #print FASTA;
 $outfile=$file.'_gene_iterm.txt';
 $outfile1=$file.'_gene_iterm_modified.txt';
 #$outfile="gene-iterm.txt";
 #$outfile1="gene-iterm-modified.txt";
 #print $outfile."\n";
 open(OUT,">$outfile") or die ("can not open $outfile");
 open(OUT1,">$outfile1") or die ("can not open");
  while(<FASTA>) {
    next if($.==1);
    my ($iterm,$score,$cat,$count,$genes)=map {s/^"(.*)"$/$1/; $_;} split /,/;
    #$list = str_replace('"','-',$list);  $text =~ tr/a/z/;
    $iterm =~ tr/"/-/;
    if ($iterm ~~ @black){
      while(/(\S+) \(\d*\)/g) {
       my $name=$1;
	  $name=~tr/a-z/A-Z/;
	  #print $name."\n";
	  if (($cat ne 'species')&&($cat ne 'technique')&&($cat ne 'cell (type/line)')){
	    print OUT "$name\t$iterm\n";
	  }
	
      }        
      #print "****************************************************************************$iterm\n";
      next;
    }
    else{
      while(/(\S+) \(\d*\)/g) {
       my $name=$1;
          #print $name."\n";
	  $name=~tr/a-z/A-Z/;
	if (($cat ne 'species')&&($cat ne 'technique')&&($cat ne 'cell (type/line)')){
	  print OUT "$name\t$iterm\n";
	  print OUT1 "$name\t$iterm\n";
	}
      }        
    }
    #print "$iterm\n";
  }
 #print "-----DONE-----\n";
 close(FASTA);
 close(OUT);
 close(OUT1);

