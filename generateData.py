#full list of available conditions
conditions = ["HEART","DEMENTIA","CKD","INHERITED_METABOLIC","HYP","DM2","OBESITY","CBD","COPD","HYL","ASTHMA","CANCER","DM1","LIVER","PREGNANCY","PULM_FIB","RHEUMATOID_ARTHRITIS","PARKINSONS","PANCREATITIS","DEV_BEH_DISORDER","PROSTATE_CANCER","LUNG_CANCER","COLORECTAL_CANCER","BREAST_CANCER","IMMUNE_DEF","LYMPHOMA_MYELOMA","LUPUS","MULTIPLE_SCLEROSIS","IMMUNE_SUPPRESSANTS","TRANS"]

#a shorter list of conditions for the `grid` layout, see below
shortConditions = ["HEART","CKD","HYP","DM2","OBESITY","HYL","ASTHMA","CANCER","LIVER","PREGNANCY","IMMUNE_SUPPRESSANTS"]

import urllib.request, json,csv, string


def getTimeSeries(condition, model, age, sex):
# grab data from the URL, only keeping the central estimate (not the conf intervals)
    url = "https://covid-risk.api.economistdatateam.com/%s?age=%i&conditions=%s&sex=%s" % (model, age, ",".join(condition), sex)
    print(url)
    with urllib.request.urlopen(url) as url:
        data = json.loads(url.read().decode())
        return data["central_estimate"]


#fix the age, from what I can tell doesn't effect the returned data we're using here
AGE = 30

#for each risk type and sex, grab the data for each condition, and write to csv in tidy(ish) format
out = csv.writer(open("data.csv","w"))
out.writerow(["condition","model","age","sex","risk"])

for model in ["hospitalisationrisk", "deathrisk"]:
    for sex in ["male","female"]:
        for condition in conditions:
            data = getTimeSeries([condition], model, AGE, sex)
            for d in data:
                out.writerow([condition, model, d[0], sex, d[1]])


#for each risk type and sex, see how CKD (chronic kidney diseasee) interacts with each condition. Write data to csv in tidy(ish) format
outCKD = csv.writer(open("ckd.csv","w"))
outCKD.writerow(["condition1", "condition2","model","age","sex","risk"])

for model in ["hospitalisationrisk", "deathrisk"]:
    for sex in ["male","female"]:
        for condition in conditions:
            # also grab the data for CKD only for each sex/model pair, to be charted along with the 2-condition data as a baseline for easier comparison
            dataHyl = getTimeSeries(['CKD', condition], model, AGE, sex)
            dataBaseline = getTimeSeries(['CKD'], model, AGE, sex)
            for d in dataHyl:
                outCKD.writerow(['CKD', condition, model + "_2cond", d[0], sex, d[1]])
            for d in dataBaseline:
                outCKD.writerow(['CKD', condition, model + "_ckd", d[0], sex, d[1]])


#for each risk type and sex, get each permutation of 2 conditions in the `shortConditions` list
outGrid = csv.writer(open('grid.csv','w'))
outGrid.writerow(["conditionA", "conditionB", "conditionLabel","model","age","sex","risk"])

for model in ["hospitalisationrisk", "deathrisk"]:
    for sex in ["male","female"]:
        for a, conditionA in enumerate(shortConditions, start=0):
            for b, conditionB in enumerate(shortConditions, start=0):
                # convert list indices to alpha characters (A-Z) to construct a series of labels that, when alphabetized (as is default for `facet_wrap` in ggplot2), puts charts in desired order
                label = "(%s%s)  %s-%s" % (string.ascii_uppercase[a],string.ascii_uppercase[b],conditionA, conditionB)
                print(label)
                dataGrid = getTimeSeries([conditionA, conditionB], model, AGE, sex)
                for d in dataGrid:
                    outGrid.writerow([conditionA, conditionB, label, model, d[0], sex, d[1]])
