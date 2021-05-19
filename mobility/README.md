# How US counties are returning to work

This repo contains code and data used to generate [this graphic](https://benchartoff.com/economist/mobility/), as part of an interview assignment for The Economist.

## The following data sources are used in the graphic
* Google's [COVID-19 Community Mobility Reports](https://www.google.com/covid19/mobility/), 2020 and 2021
	* These data were required by the brief.
	* The chart's x axis shows mobility trends for the `Workplaces` category, by county in the United States.
	* Because the baseline (0) for these data are specific to each day of the week, all data shown are for Tuesdays between 2/18/2020 and 5/11/2021. I chose Tuesdays in order to minimize weekdays which were also US holidays during this period (which show large jumps in workplace mobility patterns). The exception is 2/16/2020, Mardi Gras, which is noted in the graphic/narrative.
* US Census [county population totals](https://www.census.gov/data/datasets/time-series/demo/popest/2010s-counties-total.html), 2019
    * Dots are sized by 2019 population
* County [Presidential Election Returns](https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/VOQCHQ) 2016
    * Retrieved from the MIT Election Lab
    * Note that county totals for the 2016 electino were more readily available than for 2020. A publication-ready version of this graphic would certainly use 2020 data, but for the purposes of the exercise 2016 data surely shows similar patterns