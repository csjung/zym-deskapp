import { FormControl } from "@angular/forms";

export interface CargoInfo {
    id:string;   
    inDate:string; //작업일자    
    inTime:string;//작업시간     
    area:string;//지역    
    cheonggu:string;//청구처    
    cargoOwner:string;//화주    
    damdang:string;//담당    
    addr:string;//작업장소    
    cargoType:string;//화물타입(수출/수입/카고)    
    container:string;//컨테이너 번호    
    cargoSize:string;//화물 사이즈    
    weight:number; //중량    
    workType:string;//작업    
    price:number; //청구금액    
    fallPrice:number; //하불금액    
    status:string;//상태    
    carRemark:string;//차량비고    
    priceRemark:string;//청구비고    
    caravan:string;//상차지    
    quit:string;//하차지    
    youngcha:string;//용차구분    
    carNum:string;//차량번호
    cargoInbound:CargoInbound | undefined;
    cargoOutbound:CargoOutbound | undefined;
}

export interface CargoInbound {
    id:string;   
    blno:string;//BL No.    
    line:string;//라인    
    dono:string;//D/O No.    
    takeout:string;//반출입코드    
    dem:string;//체화료 발생일    
    over:string;//경과보관료 발생일     
    det:string;//반환지연료 발생일    
    houseBlno:string;//하우스 blno 
}

export interface CargoOutbound {
    id:string;   
    bkno:string;//부킹    
    line:string;//라인    
    sealNo:string;//SEAL No.    
    takeout:string;//반출입코드    
    tareWt:string;//TARE WEIGHT    
    port:string;//PORT    
    etaDate:string;//도착예정일    
    etaTime:string;//도착예정시간
}

//export type InputCargo = Pick<CargoInfo, 'inDate'|'inTime'|'cheonggu'|'cargoOwner'|'area'|'damdang'|'addr'|'cargoType'>;
//export type InputCargoIn = Pick<CargoInbound, 'blno'>;

