
// Configuration for this WebServer
export enum TopicalType {
    KAFKA = 'kafka',
    ZEROMQ = 'zeromq'
}
class AppConfig {
       
    // This WebServer ports
    public webServerPort = process.env.WE_WEBSERVER_PORT || 3007;     // webServer http+WS port, for running server (also client code is served from this server)

    // EntitiesService - http server
    // -----------------------------
    public entitiesServiceIP = process.env.WE_ENTITIES_SERVICE_IP || 'weserver';
    public entitiesServicePort = process.env.WE_ENTITIES_SERVICE_HTTP_PORT || 3003;
    public entitiesServiceHttpServer = 'http://' + this.entitiesServiceIP + ':' + this.entitiesServicePort;

    // FreeDrawsService - http server
    // --------------------------------
    public freeDrawsGetHttpUrl = this.entitiesServiceHttpServer + '/freeDrawsGet';
    public freeDrawsUpdateHttpUrl = this.entitiesServiceHttpServer + '/freeDrawUpdate';
    public freeDrawsDeleteHttpUrl = this.entitiesServiceHttpServer + '/freeDrawDelete';


    // Kafka host
    public kafkaHost = process.env.WE_KAFKA_CONNECTION || 'weserver:9092';

    // Zeromq hosts
    public zeromqFreeDrawsHost = process.env.WE_WS_PORT_FREE_DRAWS || 'weserver:3123'; // WeEntities    

    // Topical config
    public topicalDriverType: string = process.env.zTopicalDriverType ? process.env.zTopicalDriverType : TopicalType.ZEROMQ; // 'kafka' / 'zeromq'
    public topicalConfig;

    // Topical topics 
    public freeDrawsTopic = 'FreeDraws';    

    // Topical WS port   
    public wsFreeDrawsPort = +process.env.WE_WS_PORT_FREE_DRAWS || 5561;        


    public elasticUrl = process.env.WE_ELASTIC_URL || 'http://localhost:9200';
    public neoUrl = process.env.WE_NEO_URL || 'http://localhost:7474/db/data/transaction';

    
}

export default new AppConfig();
