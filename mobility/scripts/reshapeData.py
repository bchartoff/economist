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

# build a quick lookup to match column names to row indices
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
        
        #grab data for Tuesdays only
        if dateDate.weekday() != 1:
            continue
        if dateDate in usHolidays:
            print(dateDate)
        weekNum = week - 8 if year == 2020 else week - 8 + 53
        datestmp.append(dateStr)

        workplaceValStr = row[h["workplaces_percent_change_from_baseline"]]
        if(workplaceValStr != ''):
            tempData[tempKey]["workplace"][weekNum] = float(workplaceValStr)

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
    el = tempData[place]
    outDict = {"fips": el["fips"], "county": el["county"], "pop": el["pop"],"trumpVoteshare": el["trumpVoteshare"],  "state": el["state"] }
    outRow = [el["fips"], el["county"], el["state"], el["pop"], el["trumpVoteshare"]]
    wkData = []
    for i in range(0, maxWeek):
    # we'll set opacity to 0 for weeks with missing data. Certainly not an efficient way to do this since it ramps up the file size so much, but fine for this exercise!
        if i in el["workplace"]:
            outRow.append(1)
            wkData.append(el["workplace"][i])
        else:
            outRow.append(0)
            wkData.append(-999)

    prevWeek = 0
    for d in wkData:
        if(d == -999):
        # for weeks with missing data, keep the dots in the same location (vs going to 0 or some other value), just toggle opacity
            outRow.append(prevWeek)
        else:
            prevWeek = d
            outRow.append(d)
    out.writerow(outRow)
