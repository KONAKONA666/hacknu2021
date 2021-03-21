import os
import json
import random

from flask import Flask
from flask import request

import numpy as np
from numba import jit
from math import log, e

from flask_cors import CORS


keywords = json.loads(open("new_keywords.json", "r").read())
kw2id = {}


curr_ind = 0
for title, words in keywords:
  for word in words:
    if word[0] not in kw2id:
      kw2id[word[0]] = curr_ind
      curr_ind+=1

keywords_dict = {}

for title, words in keywords:
	keywords_dict[title] = words


answers = {}

for title, words in keywords:
  curr_vec = [0]*(curr_ind)
  for word in words:
    curr_vec[kw2id[word[0]]] = word[1]
  answers[title] = curr_vec



s2id = {}
curr = 0
for s in answers:
  if s not in s2id:
    s2id[s] = curr
    curr+=1


answer_id = [[] for _ in range(len(s2id))]
for s in answers:
  answer_id[s2id[s]] = answers[s]


answer_id = np.array(answer_id)

@jit(nopython=True)
def character_answer(spec_vector, question):
    if spec_vector[question]:
      return 1/(1+np.exp(-7*(spec_vector[question]-0.58)))
    else:
      return 0.0

@jit(nopython=True)
def calculate_spec_probability(spec, questions_so_far, answers_so_far, answer_id):
    
    P_spec = 1 / answer_id.shape[0]
    n = answer_id.shape[0]
    spec_vec = answer_id[spec]

    P_answers_given_spec = 1
    P_answers_given_not_spec = 1
    for question, answer in zip(questions_so_far, answers_so_far):
        P_answers_given_spec *= max(
            1 - abs(answer - character_answer(spec_vec, question)), 0.001)
        P_answer_not_spec = np.mean(np.array([1 - abs(answer - character_answer(answer_id[i], question))
                                          for i in range(n)
                                          if i != spec], dtype=np.float32))
        P_answers_given_not_spec *= max(P_answer_not_spec, 0.001)

    
    P_answers = P_spec * P_answers_given_spec + \
        (1 - P_spec) * P_answers_given_not_spec

   
    P_spec_given_answers = (
        P_answers_given_spec * P_spec) / P_answers

    return P_spec_given_answers



app = Flask(__name__)
CORS(app)
@app.route('/get_recs/<n>', methods=["GET", "POST"])
def get_recs(n):
	data = request.get_json()

	answers_of_user = np.array(data["answers"], dtype=np.float32)
	questions = np.array(data["questions"], dtype=np.int32)
	#print(answers, questions)
	anss = []
	
	for title in answers:
		p = calculate_spec_probability(s2id[title], questions, answers_of_user, answer_id)
		anss.append([p, title])

	
	resp_array = [title for p, title in sorted(anss)[-int(n):]]

	response = {
		"recs":  list(reversed(resp_array))
	}

	return response


@app.route('/get_suggestions/', methods=["POST"])
def get_suggetions():
	
	data = request.get_json()

	answers_np = np.array(data["answers"], dtype=np.float32)
	questions_np = np.array(data["questions"], dtype=np.int32)

	questions = data["questions"]

	if not data["questions"]:
		selected_titles = [
			"6B06101 Информационные системы",
			"6B04105 Маркетинг",
			"6B04102 Экономика МШЭ",
			"6B10101 Общая Медицина",
			"6B02139 Графический дизайн",
			"6B07201 Технология фармацевтического производства",
			"6B03102 Международные отношения",
			"6B01702 Иностранный язык: два иностранных языка",
			"6B02110 Поэзия и искусство",
			"6B03103 Психология",
			"6B04201 Юриспруденция",
			"6B05107 Биология",
			"6B07146 Космическая техника и технологии",
			"6B05401 Математика",
		] 


		res = []
		for title in selected_titles:
			words = keywords_dict[title]
			res += [words[0][0], words[1][0], words[2][0], words[3][0], words[4][0]]

		random.shuffle(res)

		return {
			"questions": [(y,  kw2id[y]) for y in res[:5]]
		}



	anss = []
	for title in answers:
		p = calculate_spec_probability(s2id[title], questions_np, answers_np, answer_id)
		anss.append([p, title])

	resp_array = [title for p, title in sorted(anss)[-10:]]
	cons_titles = []

	old_questions = questions[:]
	new_questions = []

	for title in resp_array:
		for word, score in keywords_dict[title]:
			if word not in questions and title not in cons_titles:
				cons_titles.append(title)
				questions.append(word)
				new_questions.append([score, word])

	resp = {
		"questions": [(y, kw2id[y])for x, y in sorted(new_questions)[:5]]
	}

	return resp

if __name__ == '__main__':
      app.run(port=5001)
 # [927, 876, 823, 792, 768, 735, 964, 896, 892, 891]
 # ["механика", ".."......, ...]



 # [927, 876, 823, 792, 768, 735, 964, 896, 892, 891]
 # [0, 0.25, 0.5, 0.75.....]



 #[
#   {
	
	#name: 
	#Unis: []
#}
#
#
 #]


 #