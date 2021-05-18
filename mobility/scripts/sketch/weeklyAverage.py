import csv
from datetime import date
import holidays
import numpy as np
import json


usHolidays = holidays.UnitedStates()


mobilityReader2020 = csv.reader(open("data/source/2020_US_Region_Mobility_Report.csv","r"))
mobilityReader2021 = csv.reader(open("data/source/2021_US_Region_Mobility_Report.csv","r"))
voteReader = csv.reader(open("data/source/countypres_2000-2016.csv","r"))
popReader = csv.reader(open("data/source/co-est2019-alldata.csv","r",encoding='latin1'))

#skip header
next(popReader)

voteData = {}
voteHead = next(voteReader)
for row in voteReader:
    if(row[0] == "2016" and row[6] == "Donald Trump" and row[4] != "NA" and row[8] != "NA"):
        fips = int(row[4])
        voteData[fips] = float(row[8])/float(row[9])

popData = {}
popHead = next(popReader)
for row in popReader:
    if row[0] == "40":
        # skip state totals
        continue
    fips = int(row[3] + row[4].zfill(3))
    popData[fips] = int(row[18])



mobilityHead = next(mobilityReader2020)
next(mobilityReader2021)

h = {}
for ind, val in enumerate(mobilityHead):
    h[val] = ind


tempData = {}


datestmp = []
def parseMobilityCSV(csvReader):
    t = []
    for row in csvReader:
        county = row[h["sub_region_2"]]
        state = row[h["sub_region_1"]]
        tempKey = county + ", " + state
        if county == "":
            # skip national and state rows
            continue
        fips = int(row[h["census_fips_code"]])
        if fips not in voteData:
            continue
        elif tempKey not in tempData:
            state = row[h["sub_region_1"]]
            pop = popData[fips]
            vote = voteData[fips]

            tempData[tempKey] = {"fips": fips, "county": county, "trumpVoteshare": vote, "pop": pop, "state": state, "workplace": {} }

        dateStr = row[h["date"]]
        dateDate = date.fromisoformat(dateStr)
        year = dateDate.isocalendar().year
        week = dateDate.isocalendar().week
        
        # if dateDate in usHolidays:
        #     t.append(dateDate.weekday())

        if dateDate in usHolidays or dateDate.weekday() != 1:
            continue
        weekNum = week - 8 if year == 2020 else week - 8 + 53
        datestmp.append(dateStr)
        # print(datestmp)

        # if(weekNum == 38):
        #     print(dateDate)
        # if(weekNum not in tempData[tempKey]["workplace"]):
            # tempData[tempKey]["workplace"][weekNum] = []

        workplaceValStr = row[h["workplaces_percent_change_from_baseline"]]
        # if(weekNum == 38):
        #     print(float(workplaceValStr))
        # workplaceVal = float(row[h["workplaces_percent_change_from_baseline"]])
        if(workplaceValStr != ''):
            tempData[tempKey]["workplace"][weekNum] = float(workplaceValStr)

        # print(dateStr, dateDate.isocalendar(), year, week, weekNum)

    # print(list(set(t)))
    # print(c)


parseMobilityCSV(mobilityReader2020)
parseMobilityCSV(mobilityReader2021)

maxWeek = 70

out = csv.writer(open("data/weeklyData.csv","w"))
outHead = ["fips", "county", "state", "pop", "trumpVoteshare"]

for i in range(0, maxWeek):
    outHead.append("hide%i"%i)
for i in range(0, maxWeek):
    outHead.append("wk%i"%i)

out.writerow(outHead)
for place in tempData:
    # print(place)
    el = tempData[place]
    outDict = {"fips": el["fips"], "county": el["county"], "pop": el["pop"],"trumpVoteshare": el["trumpVoteshare"],  "state": el["state"] }
    outRow = [el["fips"], el["county"], el["state"], el["pop"], el["trumpVoteshare"]]
    wkData = []
    for i in range(0, maxWeek):
        # if len(el["workplace"][]) > 0:
        if i in el["workplace"]:
            # if len(el["workplace"][i]) > 0:
            outRow.append(1)
            wkData.append(el["workplace"][i])
        else:
            outRow.append(0)
            wkData.append(-999)

    # if(el["fips"] == 47019):
    prevWeek = 0
    for d in wkData:
        if(d == -999):
            outRow.append(prevWeek)
        else:
            prevWeek = d
            outRow.append(d)
        # print(outRow)

    # print(outRow)
    out.writerow(outRow)

#     for wk in el["workplace"]:
#         if len(el["workplace"][wk]) > 0:
#             outDict["wk%i"%wk] = np.mean(el["workplace"][wk])
#     outData.append(outDict)

# with open("data/weeklyData.json","w") as f:
#     json.dump(outData, f)


# date.fromisoformat
# date.weekday 0 monday 6 sunday