from lxml import etree
import urllib2

#url = 'http://rmitsurfclub.wordpress.com'
url = 'http://rmitsurfclub.wordpress.com'
rawPage = urllib2.urlopen(url)

read = rawPage.read()
#print read
tree = etree.HTML(read)    
for href in tree.xpath("//body//a/@href"):
  print href
