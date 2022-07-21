from django import forms
from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.urls import reverse
from django_markup.markup import formatter
from markdown2 import Markdown
markdowner = Markdown()

import random

from . import util
from .models import WikiEntryModel

from . import util

class SearchForm(forms.Form):
	s_str = forms.CharField(label='Search Encyclopedia ')
	
class WikiEntryForm(forms.ModelForm):
	# specify the name of model to use 
    class Meta: 
        model = WikiEntryModel 
        fields = "__all__"


def index(request):
	entries = util.list_entries()
		
	RN = random.choice(entries)
	return render(request, "encyclopedia/index.html", {
		"form":SearchForm(),
		"entries": entries,
		"RN":RN})


def title_page(request, title_name):
	if (request.method == 'GET') and (title_name != "add_page") and (title_name != "submit_confirm") and (title_name != f"edit_page_{title_name}"):
		entries = util.list_entries()
		
		RN = random.choice(entries)
		
		for entry in entries:
			if title_name == entry:
				return render(request, f"encyclopedia/{title_name}.html", {
					"form":SearchForm(),
					"t_name":title_name,
					"RN":RN
				})
		
		else: return render(request, "encyclopedia/error.html", {
		"form":SearchForm(),
		"RN":RN})
		
		
def search_result(request):
	entries = util.list_entries()	
	RN = random.choice(entries)
	
	if request.method == 'POST':
		form = SearchForm(request.POST)
		if form.is_valid():
			SS = form.cleaned_data["s_str"]
		else:
				return render(request, "encyclopedia/index.html", {
                "form":form,
				"entries": util.list_entries(),
				"RN":RN
			})
			
	search_list_results = []
	entries = util.list_entries()
	
	for entry in entries:
		if SS == entry:
			return render(request, f"encyclopedia/{SS}.html", {
				"form":SearchForm(),
				"t_name":SS,
				"RN":RN
			})
			
		else:
			for entry in entries:
				if SS in entry:
					search_list_results.append(entry)
			
		return render(request, "encyclopedia/search_result.html", {
		"form":SearchForm(),
		"SS":SS,
		"RN":RN,
		"search_list_results": search_list_results})
		
def add_page(request):

	entry_list=[]
	entries = util.list_entries()
	for entry in entries:
		entry_list.append(entry)
		
	RN = random.choice(entry_list)
	
	form1_init_data = {'t_name':'No duplicate entry name allowed!','t_entry':'# Enter the wiki content in markdown format'}
	return render(request, f"encyclopedia/add_page.html", {
				"form":SearchForm(),
				"form1":WikiEntryForm(initial=form1_init_data),
				"RN":RN,
				"entry":"error"
			})
			
def submit_confirm(request):
	entries = util.list_entries()
		
	RN = random.choice(entries)
	
	if request.method == 'POST':
		W_E_data = WikiEntryForm(request.POST)
		if W_E_data.is_valid():
			TN = W_E_data.cleaned_data["t_name"]
			TE = W_E_data.cleaned_data["t_entry"]
			
			
		else:
			return render(request, f"encyclopedia/add_page.html", {
				"form":SearchForm(),
				"form1":W_E_data,
				"RN":RN
			})
	
	
	if (TN == "No duplicate entry name allowed!") or (TE == "# Enter the wiki content in markdown format"):
		return HttpResponse("Error: Enter content before submission")
	
	for entry in entries:
		if TN == entry:
			return HttpResponse("Error: Duplicate title name")
	
	
	file = open(f"entries/{TN}.md","w+")
	file.write(TE)
	file.close
	
	FP = "encyclopedia/layout.html"
	M_T_H = markdowner.convert(f"{TE}")
	file1 = open(f"encyclopedia/templates/encyclopedia/{TN}.html","w+")
	file1.write('{% extends "encyclopedia/layout.html" %} \n')
	file1.write('\n')
	file1.write('{% block title %} \n')
	file1.write('    wiki_{{t_name}} \n')
	file1.write('{% endblock %} \n')
	file1.write('\n')
	file1.write('{% block body %} \n')
	file1.write(M_T_H)
	file1.write('<p>to edit page click <a href="/wiki/edit_page_{{t_name}}">here</a>!</p> \n')
	file1.write('{% endblock %} \n')
	file1.close
	
	
	
	return render(request, f"encyclopedia/add_page.html", {
		"form":SearchForm(),
		"form1":W_E_data,
		"entry":TN,
		"RN":RN
		})
		
		
		
def edit_page(request, edit_page_t_name):	
	entries = util.list_entries()
	
	RN = random.choice(entries)
	
	for_edit_t_name = edit_page_t_name
	file2 = open(f"entries/{edit_page_t_name}.md","r+")
	for_edit_t_entry = file2.read
	form1_edit_init_data = {'t_name':for_edit_t_name,'t_entry':for_edit_t_entry}
	return render(request, f"encyclopedia/edit_page.html", {
				"form":SearchForm(),
				"form1":WikiEntryForm(initial=form1_edit_init_data),
				"entry":"error",
				"RN":RN})
				
def afteredit_submit_confirm(request):

	entries = util.list_entries()
		
	RN = random.choice(entries)
	
	if request.method == 'POST':
		W_E_data = WikiEntryForm(request.POST)
		if W_E_data.is_valid():
			TN = W_E_data.cleaned_data["t_name"]
			TE = W_E_data.cleaned_data["t_entry"]
			
			
		else:
			return render(request, f"encyclopedia/edit_page.html", {
				"form":SearchForm(),
				"form1":W_E_data,
				"RN":RN
			})
	
	
	file = open(f"entries/{TN}.md","w+")
	file.write(TE)
	file.close
	
	FP = "encyclopedia/layout.html"
	M_T_H = markdowner.convert(f"{TE}")
	file1 = open(f"encyclopedia/templates/encyclopedia/{TN}.html","w+")
	file1.write('{% extends "encyclopedia/layout.html" %} \n')
	file1.write('\n')
	file1.write('{% block title %} \n')
	file1.write('    wiki_{{t_name}} \n')
	file1.write('{% endblock %} \n')
	file1.write('\n')
	file1.write('{% block body %} \n')
	file1.write(M_T_H)
	file1.write('<p>to edit page click <a href="/wiki/edit_page_{{t_name}}">here</a>!</p> \n')
	file1.write('{% endblock %} \n')
	file1.close
	
	
	
	return render(request, f"encyclopedia/edit_page.html", {
		"form":SearchForm(),
		"form1":W_E_data,
		"entry":TN,
		"RN":RN
		})	
