#!/usr/bin/perl
use strict;
use warnings;
my ($posts, $refs, %missing);
for my $f (glob "_posts/*.md") {
  open my $fh, "<", $f or die;
  local $/;
  my $txt = <$fh>;
  close $fh;
  my @refs;
  while ($txt =~ m{<object\s+data="(/assets/images/[^"]+)"[^>]*>}g) {
    push @refs, $1;
  }
  my @broken = grep { ! -f substr($_,1) } @refs;
  if (@broken) {
    $posts++;
    $refs += scalar @broken;
    push @{$missing{$f}}, @broken;
  }
}
print "posts_with_broken=$posts total_broken_refs=$refs\n";
print "\n=== Posts with > 1 broken ref ===\n";
my $multi = 0;
for my $f (sort keys %missing) {
  next if @{$missing{$f}} < 2;
  $multi++;
  (my $name = $f) =~ s{^_posts/}{};
  print "$name (", scalar @{$missing{$f}}, "):\n";
  for my $b (@{$missing{$f}}) { print "  $b\n"; }
}
print "\nMulti-broken posts: $multi\n";
print "\n=== One broken ref each (sample of 30) ===\n";
my $n = 0;
for my $f (sort keys %missing) {
  next if @{$missing{$f}} != 1;
  (my $name = $f) =~ s{^_posts/}{};
  for my $b (@{$missing{$f}}) { print "$name: $b\n"; }
  $n++; last if $n >= 30;
}
