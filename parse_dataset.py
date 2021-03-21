import os
import time
import csv
import json
import requests


from bs4 import BeautifulSoup

from multiprocessing import Pool, Manager

BASE_URL = r"https://univision.kz{}"



def get_soup(url):
	r = requests.get(url)
	return BeautifulSoup(r.text, "html.parser")


def get_spec_info(args):
	soup = get_soup(BASE_URL.format(args[1]))
	print("{} is processed".format(args[0]))
	return (args[0], [
		{
			"desc": li.find("p").text,
			"name": li.find("h6").text,
			"weight": li.find("small").text
		} for li in soup.find(id="disciplines").find("ul").find_all("li") 
	])



if __name__ == "__main__":
	with open("s2url.json", "r") as f:
		dataset = {}
		urls = json.loads(f.read())
		args = []
		for url in urls.keys():
			args.append([url, urls[url]])
		# for i, spec in enumerate(urls.keys()):
		# 	print("{}/{} is parsed".format(i, len(urls.keys())))
		# 	dataset[spec] = get_spec_info(BASE_URL.format(urls[spec]))

		p =  Pool(8)
		data = p.map(get_spec_info, args)

		for title, texts in data:
			dataset[title] = texts

		with open("dataset_disc.json", "w") as d:
			d.write(json.dumps(dataset))