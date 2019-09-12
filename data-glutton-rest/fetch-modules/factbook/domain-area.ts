import * as getUuid from "uuid-by-string";

import { consts } from "../../../constants/constants";
import { store } from "../../../constants/globalStore";
import { entityMaker } from "../../../utils/entity-maker";
import { entityRefMaker } from "../../../utils/entity-ref-maker";
import { getRelation } from "../../../utils/get-objectProperty";

export function getArea(cheerioElem: CheerioSelector, country: string, countryId: string) {
    const objectProperties = store.getObjectStore("countries")[countryId].objectProperties;
	   let map = getRelation(objectProperties, consts.ONTOLOGY.HAS_DOMAIN_AREA);
	   const daId = consts.ONTOLOGY.INST_DOMAIN_AREA + getUuid(country);
	   let objectProp = {};
    let bailOut = true;
    cheerioElem("#field-area").each(() => {
		if (!map) {
			if (store.getObjectStore("domainAreas")[daId]) {
				objectProp[consts.ONTOLOGY.HAS_DOMAIN_AREA] = store.getObjectStore("domainAreas")[daId];
			} else {
				objectProp = entityMaker(
					consts.ONTOLOGY.HAS_DOMAIN_AREA,
					consts.ONTOLOGY.ONT_DOMAIN_AREA,
					daId,
					`Area of Domain for ${country}`);
				store.getObjectStore("domainAreas")[daId] = objectProp[consts.ONTOLOGY.HAS_DOMAIN_AREA];
			}
			map = objectProp[consts.ONTOLOGY.HAS_DOMAIN_AREA];
			store.getObjectStore("countries")[countryId].objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_DOMAIN_AREA, objectProp));
		}
  bailOut = false;
    });
    if (bailOut) {
        return;
    }
	   cheerioElem("#field-area > div.category_data.subfield.numeric").each((index: number, element: CheerioElement) => {
		const areaSwitch = cheerioElem(element).find("span.subfield-name").text().trim();
		const areaData = cheerioElem(element).find("span.subfield-number").text().trim();
		switch (areaSwitch) {
			case "total:":
				map.datatypeProperties[consts.ONTOLOGY.DT_TOTAL_AREA] = areaData.replace(/,|[a-z]/g, "").trim();
				break;
			case "land:":
				map.datatypeProperties[consts.ONTOLOGY.DT_LAND_AREA] = areaData.replace(/,|[a-z]/g, "").trim();
				break;
			case "water:":
				map.datatypeProperties[consts.ONTOLOGY.DT_WATER_AREA] = areaData.replace(/,|[a-z]/g, "").trim();
				break;
		}
    });
	   cheerioElem("#field-area > div > span.category_data").each((index: number, element: CheerioElement) => {
        const areaRank = cheerioElem(element).find("a").text().trim();
		      if (areaRank) {
			map.datatypeProperties[consts.ONTOLOGY.DT_AREA_RANK] = areaRank;
		}

	});
	   map.datatypeProperties[consts.ONTOLOGY.DT_UNIT] = "sq km";
	   cheerioElem("#field-area-comparative").each((index: number, element: CheerioElement) => {
        const areaGrd = cheerioElem(element).find("div.category_data.subfield.text").text().trim().replace(/\\n/g, "");
        if (areaGrd) {
            map.datatypeProperties[consts.ONTOLOGY.DT_AREA_COMPARATIVE] = areaGrd;
        }
    });
}