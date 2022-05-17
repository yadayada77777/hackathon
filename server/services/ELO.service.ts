
import AppConfig from '../config';
import * as significantELOs from './elasticQueries/significantELOsInPolygon.json';

import proxy from '../utils/proxy';

// get all significant ELOs within/intersacting polygon
// significant ELOs are ELOs with name property and type != Unknown
export async function getSignificantELOs(polygon: any){
	
		try {
			const queryBody: any = JSON.parse(JSON.stringify(significantELOs));
			const queryPolygon = polygon.map(coordinate => { return [coordinate.longitude, coordinate.latitude]; })
			queryPolygon.push([polygon[0].longitude, polygon[0].latitude]);
			queryBody.query.bool.filter[1].geo_shape.geometry.shape.coordinates[0] = queryPolygon;
			const options = {
				url: AppConfig.elasticUrl + '/buildings/_search?size=10000',				
				method: 'GET',
				data: queryBody
			}
			const res = await proxy.get(options);
			return convertElasticElement(res);
		} catch (e) {
			console.error('get significantELOs - error in elastic query ' + e);
			return undefined;
	
		}
}

function convertElasticElement(queryResults: any): any {
    const elos = queryResults.hits.hits.map((element) => ({source: element._source, id: element._id}));
    return elos;
}



	
	
	
	
