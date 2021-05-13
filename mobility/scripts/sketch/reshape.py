import csv

mobilityReader = csv.reader(open("data/source/2021_US_Region_Mobility_Report.csv","r"))
giniReader = csv.reader(open("data/source/acs2019_5yr_B19083_05000US46119.csv","r"))
incomeReader = csv.reader(open("data/source/acs2019_5yr_B19013_05000US46119.csv","r"))
voteReader = csv.reader(open("data/source/countypres_2000-2016.csv","r"))
popReader = csv.reader(open("data/source/co-est2019-alldata.csv","r",encoding='latin1'))

giniWriter = csv.writer(open("data/gini.csv","w"))
incomeWriter = csv.writer(open("data/income.csv","w"))
recentWriter = csv.writer(open("data/recent.csv","w"))

mobilityHead = next(mobilityReader)

h = {}
for ind, val in enumerate(mobilityHead):
    h[val] = ind

gini = {}
giniHead = next(giniReader)
for row in giniReader:
    fips = int(row[0].split("US")[1])
    gini[fips] = [row[2],row[3]]

income = {}
incomeHead = next(incomeReader)
for row in incomeReader:
    try:
        fips = int(row[0].split("US")[1])
    except:
        continue
    income[fips] = [row[2],row[3]]

vote = {}
voteHead = next(voteReader)
for row in voteReader:
    if(row[0] == "2016" and row[6] == "Donald Trump" and row[4] != "NA" and row[8] != "NA"):
        fips = int(row[4])
        vote[fips] = float(row[8])/float(row[9])

pop = {}
popHead = next(popReader)
for row in popReader:
    if row[0] == "40":
        # skip state totals
        continue
    fips = int(row[3] + row[4].zfill(3))
    pop[fips] = int(row[18])
print(pop)

giniWriter.writerow(["county","state","fips","date","retail","grocery","parks","transit","workplaces","residential","gini","giniError"])
recentWriter.writerow(["county","state","fips","date","retail","grocery","parks","transit","workplaces","residential","voteshare","pop"])
incomeWriter.writerow(["county","state","fips","date","retail","grocery","parks","transit","workplaces","residential","income","incomeError"])

for row in mobilityReader:
    county = row[h["sub_region_2"]]
    if county == "":
        continue
    else:
        # print(county)
        fips = int(row[h["census_fips_code"]])
        g = gini[fips]
        i = income[fips]
        try:
            v = vote[fips]
        except:
            v= 0
        p = pop[fips]

        giniRow = [ row[h["sub_region_2"]], row[h["sub_region_1"]], fips, row[h["date"]], row[h["retail_and_recreation_percent_change_from_baseline"]], row[h["grocery_and_pharmacy_percent_change_from_baseline"]], row[h["parks_percent_change_from_baseline"]], row[h["transit_stations_percent_change_from_baseline"]], row[h["workplaces_percent_change_from_baseline"]], row[h["residential_percent_change_from_baseline"]], g[0], g[1] ]
        incomeRow = [ row[h["sub_region_2"]], row[h["sub_region_1"]], fips, row[h["date"]], row[h["retail_and_recreation_percent_change_from_baseline"]], row[h["grocery_and_pharmacy_percent_change_from_baseline"]], row[h["parks_percent_change_from_baseline"]], row[h["transit_stations_percent_change_from_baseline"]], row[h["workplaces_percent_change_from_baseline"]], row[h["residential_percent_change_from_baseline"]], i[0], i[1] ]
        recentRow = [ row[h["sub_region_2"]], row[h["sub_region_1"]], fips, row[h["date"]], row[h["retail_and_recreation_percent_change_from_baseline"]], row[h["grocery_and_pharmacy_percent_change_from_baseline"]], row[h["parks_percent_change_from_baseline"]], row[h["transit_stations_percent_change_from_baseline"]], row[h["workplaces_percent_change_from_baseline"]], row[h["residential_percent_change_from_baseline"]], v, p ]


        giniWriter.writerow(giniRow)
        incomeWriter.writerow(incomeRow)

        if row[h["date"]] == "2021-01-07":
            recentWriter.writerow(recentRow)
