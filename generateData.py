conditions = ["HEART","DEMENTIA","CKD","INHERITED_METABOLIC","HYP","DM2","OBESITY","CBD","COPD","HYL","ASTHMA","CANCER","DM1","LIVER","PREGNANCY","PULM_FIB","RHEUMATOID_ARTHRITIS","PARKINSONS","PANCREATITIS","DEV_BEH_DISORDER","PROSTATE_CANCER","LUNG_CANCER","COLORECTAL_CANCER","BREAST_CANCER","IMMUNE_DEF","LYMPHOMA_MYELOMA","LUPUS","MULTIPLE_SCLEROSIS","IMMUNE_SUPPRESSANTS","TRANS"]

# conditions = ["CKD"]

import urllib.request, json,csv


def getTimeSeries(condition, model, age, sex):
    url = "https://covid-risk.api.economistdatateam.com/%s?age=%i&conditions=%s&sex=%s" % (model, age, ",".join(condition), sex)
    print(url)
    with urllib.request.urlopen(url) as url:
        data = json.loads(url.read().decode())
        return data["central_estimate"]

print(getTimeSeries(["CKD"], "hospitalisationrisk", 30,"female"))

out = csv.writer(open("data.csv","w"))
out.writerow(["condition","model","age","sex","risk"])

AGE = 30

# for model in ["hospitalisationrisk", "deathrisk"]:
#     for sex in ["male","female"]:
#         for condition in conditions:
#             data = getTimeSeries([condition], model, AGE, sex)
#             for d in data:
#                 out.writerow([condition, model, d[0], sex, d[1]])


outHyl = csv.writer(open("ckd.csv","w"))
outHyl.writerow(["condition1", "condition2","model","age","sex","risk"])

for model in ["hospitalisationrisk", "deathrisk"]:
    for sex in ["male","female"]:
        for condition in conditions:
            dataHyl = getTimeSeries(['CKD', condition], model, AGE, sex)
            dataBaseline = getTimeSeries(['CKD'], model, AGE, sex)
            for d in dataHyl:
                outHyl.writerow(['CKD', condition, model + "_2cond", d[0], sex, d[1]])
            for d in dataBaseline:
                outHyl.writerow(['CKD', condition, model + "_ckd", d[0], sex, d[1]])
