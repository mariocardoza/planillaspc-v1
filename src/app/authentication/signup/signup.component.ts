import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators,NG_VALUE_ACCESSOR, FormControl} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { ICredencial } from 'src/app/core/models/credencial';
import { IconOptions } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Item } from 'src/app/core/models/field.interface';
import { MatSelect } from '@angular/material/select';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  providers: [
    {
      provide: [STEPPER_GLOBAL_OPTIONS,NG_VALUE_ACCESSOR],
      useValue: {showError: true},
      multi: true,
    },
  ],
})
export class SignupComponent implements OnInit {
  error= '';
  accepted: boolean = false;
  registerForm: FormGroup;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  datosUsuario: ICredencial;
  public itemFilterCtrl1: FormControl = new FormControl();
  public filteredItems1: ReplaySubject<Item[]> = new ReplaySubject<Item[]>(1);
  @ViewChild('singleSelect1', { static: true }) singleSelect1: MatSelect;
  protected _onDestroy1 = new Subject<void>();
  hide = true;
  protected items1: Item[];
  public response: { dbPath: '' }
  sexos = [
    {value:'F', name:'Femenino'},
    {value:'M', name:'Masculino'},
  ];
  departments = [{"tcampo1":"ES0302    ","tcampo2":"ACAJUTLA - SONSONATE"},{"tcampo1":"ES0402    ","tcampo2":"AGUA CALIENTE - CHALATENANGO"},{"tcampo1":"ES0602    ","tcampo2":"AGUILARES - SAN SALVADOR"},{"tcampo1":"ES0101    ","tcampo2":"AHUACHAPAN - AHUACHAPAN"},{"tcampo1":"ES1102    ","tcampo2":"ALEGRIA - USULUTAN"},{"tcampo1":"ES1402    ","tcampo2":"ANAMOROS - LA UNION"},{"tcampo1":"ES0502    ","tcampo2":"ANTIGUO CUSCATLAN - LA LIBERTAD"},{"tcampo1":"ES0102    ","tcampo2":"APANECA - AHUACHAPAN"},{"tcampo1":"ES1002    ","tcampo2":"APASTEPEQUE - SAN VICENTE"},{"tcampo1":"ES0603    ","tcampo2":"APOPA - SAN SALVADOR"},{"tcampo1":"ES1302    ","tcampo2":"ARAMBALA - MORAZAN"},{"tcampo1":"ES0403    ","tcampo2":"ARCATAO - CHALATENANGO"},{"tcampo1":"ES0303    ","tcampo2":"ARMENIA - SONSONATE"},{"tcampo1":"ES0103    ","tcampo2":"ATIQUIZAYA - AHUACHAPAN"},{"tcampo1":"ES0604    ","tcampo2":"AYUTUXTEPEQUE - SAN SALVADOR"},{"tcampo1":"ES0404    ","tcampo2":"AZACUALPA - CHALATENANGO"},{"tcampo1":"ES1103    ","tcampo2":"BERLIN - USULUTAN"},{"tcampo1":"ES1403    ","tcampo2":"BOLIVAR - LA UNION"},{"tcampo1":"ES1303    ","tcampo2":"CACAOPERA - MORAZAN"},{"tcampo1":"ES1104    ","tcampo2":"CALIFORNIA - USULUTAN"},{"tcampo1":"ES0304    ","tcampo2":"CALUCO - SONSONATE"},{"tcampo1":"ES0405    ","tcampo2":"CANCASQUE - CHALATENANGO"},{"tcampo1":"ES0702    ","tcampo2":"CANDELARIA - CUSCATLAN"},{"tcampo1":"ES0202    ","tcampo2":"CANDELARIA DE LA FRONTERA - SANTA ANA"},{"tcampo1":"ES1202    ","tcampo2":"CAROLINA - SAN MIGUEL"},{"tcampo1":"ES0401    ","tcampo2":"CHALATENANGO - CHALATENANGO"},{"tcampo1":"ES0204    ","tcampo2":"CHALCHUAPA - SANTA ANA"},{"tcampo1":"ES1205    ","tcampo2":"CHAPELTIQUE - SAN MIGUEL"},{"tcampo1":"ES1305    ","tcampo2":"CHILANGA - MORAZAN"},{"tcampo1":"ES0506    ","tcampo2":"CHILTIUPAN - LA LIBERTAD"},{"tcampo1":"ES1206    ","tcampo2":"CHINAMECA - SAN MIGUEL"},{"tcampo1":"ES1207    ","tcampo2":"CHIRILAGUA - SAN MIGUEL"},{"tcampo1":"ES0902    ","tcampo2":"CINQUERA - CABAÑAS"},{"tcampo1":"ES0406    ","tcampo2":"CITALA - CHALATENANGO"},{"tcampo1":"ES0503    ","tcampo2":"CIUDAD ARCE - LA LIBERTAD"},{"tcampo1":"ES1203    ","tcampo2":"CIUDAD BARRIOS - SAN MIGUEL"},{"tcampo1":"ES0606    ","tcampo2":"CIUDAD DELGADO - SAN SALVADOR"},{"tcampo1":"ES0203    ","tcampo2":"COATEPEQUE - SANTA ANA"},{"tcampo1":"ES0701    ","tcampo2":"COJUTEPEQUE - CUSCATLAN"},{"tcampo1":"ES0504    ","tcampo2":"COLON - LA LIBERTAD"},{"tcampo1":"ES1204    ","tcampo2":"COMACARAN - SAN MIGUEL"},{"tcampo1":"ES0407    ","tcampo2":"COMALAPA - CHALATENANGO"},{"tcampo1":"ES0505    ","tcampo2":"COMASAGUA - LA LIBERTAD"},{"tcampo1":"ES1105    ","tcampo2":"CONCEPCION BATRES - USULUTAN"},{"tcampo1":"ES0104    ","tcampo2":"CONCEPCION DE ATACO - AHUACHAPAN"},{"tcampo1":"ES1404    ","tcampo2":"CONCEPCION DE ORIENTE - LA UNION"},{"tcampo1":"ES0408    ","tcampo2":"CONCEPCION QUEZALTEPEQUE - CHALATENANGO"},{"tcampo1":"ES1405    ","tcampo2":"CONCHAGUA - LA UNION"},{"tcampo1":"ES1304    ","tcampo2":"CORINTO - MORAZAN"},{"tcampo1":"ES0305    ","tcampo2":"CUISNAHUAT - SONSONATE"},{"tcampo1":"ES0605    ","tcampo2":"CUSCATANCINGO - SAN SALVADOR"},{"tcampo1":"ES0802    ","tcampo2":"CUYULTITAN - LA PAZ"},{"tcampo1":"ES1306    ","tcampo2":"DELICIAS DE CONCEPCION - MORAZAN"},{"tcampo1":"ES0903    ","tcampo2":"DOLORES - CABAÑAS"},{"tcampo1":"ES0409    ","tcampo2":"DULCE NOMBRE DE MARIA - CHALATENANGO"},{"tcampo1":"ES0703    ","tcampo2":"EL CARMEN - CUSCATLAN"},{"tcampo1":"ES1406    ","tcampo2":"EL CARMEN - LA UNION"},{"tcampo1":"ES0410    ","tcampo2":"EL CARRIZAL - CHALATENANGO"},{"tcampo1":"ES0205    ","tcampo2":"EL CONGO - SANTA ANA"},{"tcampo1":"ES1307    ","tcampo2":"EL DIVISADERO - MORAZAN"},{"tcampo1":"ES0607    ","tcampo2":"EL PAISNAL - SAN SALVADOR"},{"tcampo1":"ES0411    ","tcampo2":"EL PARAISO - CHALATENANGO"},{"tcampo1":"ES0206    ","tcampo2":"EL PORVENIR - SANTA ANA"},{"tcampo1":"ES0105    ","tcampo2":"EL REFUGIO - AHUACHAPAN"},{"tcampo1":"ES0704    ","tcampo2":"EL ROSARIO - CUSCATLAN"},{"tcampo1":"ES0803    ","tcampo2":"EL ROSARIO - LA PAZ"},{"tcampo1":"ES1308    ","tcampo2":"EL ROSARIO - MORAZAN"},{"tcampo1":"ES1208    ","tcampo2":"EL TRANSITO - SAN MIGUEL"},{"tcampo1":"ES1106    ","tcampo2":"EL TRIUNFO - USULUTAN"},{"tcampo1":"ES1407    ","tcampo2":"ELSAUCE - LA UNION"},{"tcampo1":"ES1107    ","tcampo2":"EREGUAYQUIN - USULUTAN"},{"tcampo1":"ES1108    ","tcampo2":"ESTANZUELAS - USULUTAN"},{"tcampo1":"ES0904    ","tcampo2":"GUACOTECTI - CABAÑAS"},{"tcampo1":"ES1003    ","tcampo2":"GUADALUPE - SAN VICENTE"},{"tcampo1":"ES1309    ","tcampo2":"GUALOCOCTI - MORAZAN"},{"tcampo1":"ES1310    ","tcampo2":"GUATAJIAGUA - MORAZAN"},{"tcampo1":"ES0106    ","tcampo2":"GUAYMANGO - AHUACHAPAN"},{"tcampo1":"ES0608    ","tcampo2":"GUAZAPA - SAN SALVADOR"},{"tcampo1":"ES0507    ","tcampo2":"HUIZUCAR - LA LIBERTAD"},{"tcampo1":"ES0905    ","tcampo2":"ILOBASCO - CABAÑAS"},{"tcampo1":"ES0609    ","tcampo2":"ILOPANGO - SAN SALVADOR"},{"tcampo1":"ES1408    ","tcampo2":"INTIPUCA - LA UNION"},{"tcampo1":"ES0306    ","tcampo2":"IZALCO - SONSONATE"},{"tcampo1":"ES0508    ","tcampo2":"JAYAQUE - LA LIBERTAD"},{"tcampo1":"ES0804    ","tcampo2":"JERUSALEN - LA PAZ"},{"tcampo1":"ES0509    ","tcampo2":"JICALAPA - LA LIBERTAD"},{"tcampo1":"ES1109    ","tcampo2":"JIQUILISCO - USULUTAN"},{"tcampo1":"ES1311    ","tcampo2":"JOATECA - MORAZAN"},{"tcampo1":"ES1312    ","tcampo2":"JOCOAITIQUE - MORAZAN"},{"tcampo1":"ES1313    ","tcampo2":"JOCORO - MORAZAN"},{"tcampo1":"ES0307    ","tcampo2":"JUAYUA - SONSONATE"},{"tcampo1":"ES1110    ","tcampo2":"JUCUAPA - USULUTAN"},{"tcampo1":"ES1111    ","tcampo2":"JUCUARAN - USULUTAN"},{"tcampo1":"ES0107    ","tcampo2":"JUJUTLA - AHUACHAPAN"},{"tcampo1":"ES0906    ","tcampo2":"JUTIAPA - CABAÑAS"},{"tcampo1":"ES0412    ","tcampo2":"LA LAGUNA - CHALATENANGO"},{"tcampo1":"ES0510    ","tcampo2":"LA LIBERTAD - LA LIBERTAD"},{"tcampo1":"ES0413    ","tcampo2":"LA PALMA - CHALATENANGO"},{"tcampo1":"ES0414    ","tcampo2":"LA REINA - CHALATENANGO"},{"tcampo1":"ES1401    ","tcampo2":"LA UNION - LA UNION"},{"tcampo1":"ES0415    ","tcampo2":"LAS FLORES - CHALATENANGO"},{"tcampo1":"ES0416    ","tcampo2":"LAS VUELTAS - CHALATENANGO"},{"tcampo1":"ES1409    ","tcampo2":"LISLIQUE - LA UNION"},{"tcampo1":"ES1209    ","tcampo2":"LOLOTIQUE - SAN MIGUEL"},{"tcampo1":"ES1314    ","tcampo2":"LOLOTIQUILLO - MORAZAN"},{"tcampo1":"ES0207    ","tcampo2":"MASAHUAT - SANTA ANA"},{"tcampo1":"ES1315    ","tcampo2":"MEANGUERA - MORAZAN"},{"tcampo1":"ES1410    ","tcampo2":"MEANGUERA DEL GOLFO - LA UNION"},{"tcampo1":"ES0610    ","tcampo2":"MEJICANOS - SAN SALVADOR"},{"tcampo1":"ES0805    ","tcampo2":"MERCEDES LA CEIBA - LA PAZ"},{"tcampo1":"ES1112    ","tcampo2":"MERCEDES UMAÑA - USULUTAN"},{"tcampo1":"ES0208    ","tcampo2":"METAPAN - SANTA ANA"},{"tcampo1":"ES1210    ","tcampo2":"MONCAGUA - SAN MIGUEL"},{"tcampo1":"ES0705    ","tcampo2":"MONTE SAN JUAN - CUSCATLAN"},{"tcampo1":"ES0309    ","tcampo2":"NAHUILINGO - SONSONATE"},{"tcampo1":"ES0308    ","tcampo2":"NAHUIZALCO - SONSONATE"},{"tcampo1":"ES0611    ","tcampo2":"NEJAPA - SAN SALVADOR"},{"tcampo1":"ES0417    ","tcampo2":"NOMBRE DE JESUS - CHALATENANGO"},{"tcampo1":"ES0418    ","tcampo2":"NUEVA CONCEPCION - CHALATENANGO"},{"tcampo1":"ES1411    ","tcampo2":"NUEVA ESPARTA - LA UNION"},{"tcampo1":"ES1113    ","tcampo2":"NUEVA GRANADA - USULUTAN"},{"tcampo1":"ES1211    ","tcampo2":"NUEVA GUADALUPE - SAN MIGUEL"},{"tcampo1":"ES0419    ","tcampo2":"NUEVA TRINIDAD - CHALATENANGO"},{"tcampo1":"ES0511    ","tcampo2":"NUEVO CUSCATLAN - LA LIBERTAD"},{"tcampo1":"ES1212    ","tcampo2":"NUEVO EDEN DE SAN JUAN - SAN MIGUEL"},{"tcampo1":"ES0420    ","tcampo2":"OJOS DE AGUA - CHALATENANGO"},{"tcampo1":"ES0806    ","tcampo2":"OLOCUILTA - LA PAZ"},{"tcampo1":"ES0706    ","tcampo2":"ORATORIO DE CONCEPCION - CUSCATLAN"},{"tcampo1":"ES1316    ","tcampo2":"OSICALA - MORAZAN"},{"tcampo1":"ES1114    ","tcampo2":"OZATLAN - USULUTAN"},{"tcampo1":"ES0612    ","tcampo2":"PANCHIMALCO - SAN SALVADOR"},{"tcampo1":"ES0807    ","tcampo2":"PARAISO DE OSORIO - LA PAZ"},{"tcampo1":"ES1412    ","tcampo2":"PASAQUINA - LA UNION"},{"tcampo1":"ES1317    ","tcampo2":"PERQUIN - MORAZAN"},{"tcampo1":"ES1413    ","tcampo2":"POLOROS - LA UNION"},{"tcampo1":"ES0421    ","tcampo2":"POTONICO - CHALATENANGO"},{"tcampo1":"ES1115    ","tcampo2":"PUERTO EL TRIUNFO - USULUTAN"},{"tcampo1":"ES1213    ","tcampo2":"QUELEPA - SAN MIGUEL"},{"tcampo1":"ES0513    ","tcampo2":"QUEZALTEPEQUE - LA LIBERTAD"},{"tcampo1":"ES0613    ","tcampo2":"ROSARIO DE MORA - SAN SALVADOR"},{"tcampo1":"ES0514    ","tcampo2":"SACACOYO - LA LIBERTAD"},{"tcampo1":"ES0310    ","tcampo2":"SALCOATITAN - SONSONATE"},{"tcampo1":"ES1116    ","tcampo2":"SAN AGUSTIN - USULUTAN"},{"tcampo1":"ES1414    ","tcampo2":"SAN ALEJO - LA UNION"},{"tcampo1":"ES1214    ","tcampo2":"SAN ANTONIO - SAN MIGUEL"},{"tcampo1":"ES0423    ","tcampo2":"SAN ANTONIO DE LOS RANCHOS - CHALATENANGO"},{"tcampo1":"ES0311    ","tcampo2":"SAN ANTONIO DEL MONTE - SONSONATE"},{"tcampo1":"ES0422    ","tcampo2":"SAN ANTONIO LA CRUZ - CHALATENANGO"},{"tcampo1":"ES0808    ","tcampo2":"SAN ANTONIO MASAHUAT - LA PAZ"},{"tcampo1":"ES0209    ","tcampo2":"SAN ANTONIO PAJONAL - SANTA ANA"},{"tcampo1":"ES1419    ","tcampo2":"SAN ANTONIO SILVA - LA UNION"},{"tcampo1":"ES1221    ","tcampo2":"SAN ANTONIO SILVA - SAN MIGUEL"},{"tcampo1":"ES0707    ","tcampo2":"SAN BARTOLOME PERULAPIA - CUSCATLAN"},{"tcampo1":"ES1117    ","tcampo2":"SAN BUENA VENTURA - USULUTAN"},{"tcampo1":"ES1318    ","tcampo2":"SAN CARLOS - MORAZAN"},{"tcampo1":"ES1004    ","tcampo2":"SAN CAYETANO ISTEPEQUE - SAN VICENTE"},{"tcampo1":"ES0708    ","tcampo2":"SAN CRISTOBAL - CUSCATLAN"},{"tcampo1":"ES1118    ","tcampo2":"SAN DIONISIO - USULUTAN"},{"tcampo1":"ES0809    ","tcampo2":"SAN EMIGDIO - LA PAZ"},{"tcampo1":"ES1005    ","tcampo2":"SAN ESTEBAN CATARINA - SAN VICENTE"},{"tcampo1":"ES0424    ","tcampo2":"SAN FERNANDO - CHALATENANGO"},{"tcampo1":"ES1319    ","tcampo2":"SAN FERNANDO - MORAZAN"},{"tcampo1":"ES0810    ","tcampo2":"SAN FRANCISCO CHINAMECA - LA PAZ"},{"tcampo1":"ES1301    ","tcampo2":"SAN FRANCISCO GOTERA - MORAZAN"},{"tcampo1":"ES1119    ","tcampo2":"SAN FRANCISCO JAVIER - USULUTAN"},{"tcampo1":"ES0425    ","tcampo2":"SAN FRANCISCO LEMPA - CHALATENANGO"},{"tcampo1":"ES0108    ","tcampo2":"SAN FRANCISCO MENENDEZ - AHUACHAPAN"},{"tcampo1":"ES0426    ","tcampo2":"SAN FRANCISCO MORAZAN - CHALATENANGO"},{"tcampo1":"ES1215    ","tcampo2":"SAN GERARDO - SAN MIGUEL"},{"tcampo1":"ES0427    ","tcampo2":"SAN IGNACIO - CHALATENANGO"},{"tcampo1":"ES1006    ","tcampo2":"SAN ILDEFONSO - SAN VICENTE"},{"tcampo1":"ES0907    ","tcampo2":"SAN ISIDRO - CABAÑAS"},{"tcampo1":"ES1320    ","tcampo2":"SAN ISIDRO - MORAZAN"},{"tcampo1":"ES0428    ","tcampo2":"SAN ISIDRO LABRADOR - CHALATENANGO"},{"tcampo1":"ES1216    ","tcampo2":"SAN JORGE - SAN MIGUEL"},{"tcampo1":"ES1415    ","tcampo2":"SAN JOSE - LA UNION"},{"tcampo1":"ES0434    ","tcampo2":"SAN JOSE CANCASQUE - CHALATENANGO"},{"tcampo1":"ES0709    ","tcampo2":"SAN JOSE GUAYABAL - CUSCATLAN"},{"tcampo1":"ES0515    ","tcampo2":"SAN JOSE VILLANUEVA - LA LIBERTAD"},{"tcampo1":"ES0811    ","tcampo2":"SAN JUAN NONUALCO - LA PAZ"},{"tcampo1":"ES0512    ","tcampo2":"SAN JUAN OPICO - LA LIBERTAD"},{"tcampo1":"ES0812    ","tcampo2":"SAN JUAN TALPA - LA PAZ"},{"tcampo1":"ES0813    ","tcampo2":"SAN JUAN TEPEZONTES - LA PAZ"},{"tcampo1":"ES0312    ","tcampo2":"SAN JULIAN - SONSONATE"},{"tcampo1":"ES0109    ","tcampo2":"SAN LORENZO - AHUACHAPAN"},{"tcampo1":"ES1007    ","tcampo2":"SAN LORENZO - SAN VICENTE"},{"tcampo1":"ES1217    ","tcampo2":"SAN LUIS DE LA REINA - SAN MIGUEL"},{"tcampo1":"ES0429    ","tcampo2":"SAN LUIS DEL CARMEN - CHALATENANGO"},{"tcampo1":"ES0815    ","tcampo2":"SAN LUIS LA HERRADURA - LA PAZ"},{"tcampo1":"ES0814    ","tcampo2":"SAN LUIS TALPA - LA PAZ"},{"tcampo1":"ES0614    ","tcampo2":"SAN MARCOS - SAN SALVADOR"},{"tcampo1":"ES0615    ","tcampo2":"SAN MARTIN - SAN SALVADOR"},{"tcampo1":"ES0516    ","tcampo2":"SAN MATIAS - LA LIBERTAD"},{"tcampo1":"ES1201    ","tcampo2":"SAN MIGUEL - SAN MIGUEL"},{"tcampo1":"ES0430    ","tcampo2":"SAN MIGUEL DE MERCEDES - CHALATENANGO"},{"tcampo1":"ES0816    ","tcampo2":"SAN MIGUEL TEPEZONTES - LA PAZ"},{"tcampo1":"ES0517    ","tcampo2":"SAN PABLO TACACHICO - LA LIBERTAD"},{"tcampo1":"ES0817    ","tcampo2":"SAN PEDRO MASAHUAT - LA PAZ"},{"tcampo1":"ES0818    ","tcampo2":"SAN PEDRO NONUALCO - LA PAZ"},{"tcampo1":"ES0710    ","tcampo2":"SAN PEDRO PERULAPAN - CUSCATLAN"},{"tcampo1":"ES0110    ","tcampo2":"SAN PEDRO PUXTLA - AHUACHAPAN"},{"tcampo1":"ES0431    ","tcampo2":"SAN RAFAEL - CHALATENANGO"},{"tcampo1":"ES1218    ","tcampo2":"SAN RAFAEL - SAN MIGUEL"},{"tcampo1":"ES0711    ","tcampo2":"SAN RAFAEL CEDROS - CUSCATLAN"},{"tcampo1":"ES0819    ","tcampo2":"SAN RAFAEL OBRAJUELO - LA PAZ"},{"tcampo1":"ES0712    ","tcampo2":"SAN RAMON - CUSCATLAN"},{"tcampo1":"ES0601    ","tcampo2":"SAN SALVADOR - SAN SALVADOR"},{"tcampo1":"ES1008    ","tcampo2":"SAN SEBASTIAN - SAN VICENTE"},{"tcampo1":"ES0210    ","tcampo2":"SAN SEBASTIAN SALITRILLO - SANTA ANA"},{"tcampo1":"ES1321    ","tcampo2":"SAN SIMON - MORAZAN"},{"tcampo1":"ES1001    ","tcampo2":"SAN VICENTE - SAN VICENTE"},{"tcampo1":"ES0201    ","tcampo2":"SANTA ANA - SANTA ANA"},{"tcampo1":"ES0313    ","tcampo2":"SANTA CATARINA MASAHUAT - SONSONATE"},{"tcampo1":"ES1009    ","tcampo2":"SANTA CLARA - SAN VICENTE"},{"tcampo1":"ES0713    ","tcampo2":"SANTA CRUZ ANALQUITO - CUSCATLAN"},{"tcampo1":"ES0714    ","tcampo2":"SANTA CRUZ MICHAPA - CUSCATLAN"},{"tcampo1":"ES1120    ","tcampo2":"SANTA ELENA - USULUTAN"},{"tcampo1":"ES0314    ","tcampo2":"SANTA ISABEL ISHUATAN - SONSONATE"},{"tcampo1":"ES1121    ","tcampo2":"SANTA MARIA - USULUTAN"},{"tcampo1":"ES0820    ","tcampo2":"SANTA MARIA OSTUMA - LA PAZ"},{"tcampo1":"ES0432    ","tcampo2":"SANTA RITA - CHALATENANGO"},{"tcampo1":"ES1416    ","tcampo2":"SANTA ROSA DE LIMA - LA UNION"},{"tcampo1":"ES0211    ","tcampo2":"SANTA ROSA GUACHIPILIN - SANTA ANA"},{"tcampo1":"ES0501    ","tcampo2":"SANTA TECLA - LA LIBERTAD"},{"tcampo1":"ES0212    ","tcampo2":"SANTIAGO DE LA FRONTERA - SANTA ANA"},{"tcampo1":"ES1122    ","tcampo2":"SANTIAGO DE MARIA - USULUTAN"},{"tcampo1":"ES0821    ","tcampo2":"SANTIAGO NONUALCO - LA PAZ"},{"tcampo1":"ES0616    ","tcampo2":"SANTIAGO TEXACUANGOS - SAN SALVADOR"},{"tcampo1":"ES1010    ","tcampo2":"SANTO DOMINGO - SAN VICENTE"},{"tcampo1":"ES0315    ","tcampo2":"SANTO DOMINGO - SONSONATE"},{"tcampo1":"ES0617    ","tcampo2":"SANTO TOMAS - SAN SALVADOR"},{"tcampo1":"ES1322    ","tcampo2":"SENSEMBRA - MORAZAN"},{"tcampo1":"ES0901    ","tcampo2":"SENSUNTEPEQUE - CABAÑAS"},{"tcampo1":"ES1219    ","tcampo2":"SESORI - SAN MIGUEL"},{"tcampo1":"00        ","tcampo2":"SIN SELECCIONAR"},{"tcampo1":"ES1323    ","tcampo2":"SOCIEDAD - MORAZAN"},{"tcampo1":"ES0301    ","tcampo2":"SONSONATE - SONSONATE"},{"tcampo1":"ES0316    ","tcampo2":"SONZACATE - SONSONATE"},{"tcampo1":"ES0618    ","tcampo2":"SOYAPANGO - SAN SALVADOR"},{"tcampo1":"ES0715    ","tcampo2":"SUCHITOTO - CUSCATLAN"},{"tcampo1":"ES0111    ","tcampo2":"TACUBA - AHUACHAPAN"},{"tcampo1":"ES0518    ","tcampo2":"TALNIQUE - LA LIBERTAD"},{"tcampo1":"ES0519    ","tcampo2":"TAMANIQUE - LA LIBERTAD"},{"tcampo1":"ES0822    ","tcampo2":"TAPALHUACA - LA PAZ"},{"tcampo1":"ES1123    ","tcampo2":"TECAPAN - USULUTAN"},{"tcampo1":"ES1011    ","tcampo2":"TECOLUCA - SAN VICENTE"},{"tcampo1":"ES0908    ","tcampo2":"TEJUTEPEQUE - CABAÑAS"},{"tcampo1":"ES0433    ","tcampo2":"TEJUTLA - CHALATENANGO"},{"tcampo1":"ES0716    ","tcampo2":"TENANCINGO - CUSCATLAN"},{"tcampo1":"ES0520    ","tcampo2":"TEOTEPEQUE - LA LIBERTAD"},{"tcampo1":"ES0521    ","tcampo2":"TEPECOYO - LA LIBERTAD"},{"tcampo1":"ES1012    ","tcampo2":"TEPETITAN - SAN VICENTE"},{"tcampo1":"ES0213    ","tcampo2":"TEXISTEPEQUE - SANTA ANA"},{"tcampo1":"ES0619    ","tcampo2":"TONACATEPEQUE - SAN SALVADOR"},{"tcampo1":"ES1324    ","tcampo2":"TOROLA - MORAZAN"},{"tcampo1":"ES0112    ","tcampo2":"TURIN - AHUACHAPAN"},{"tcampo1":"ES1220    ","tcampo2":"ULUAZAPA - SAN MIGUEL"},{"tcampo1":"ES1101    ","tcampo2":"USULUTAN - USULUTAN"},{"tcampo1":"ES1013    ","tcampo2":"VERAPAZ - SAN VICENTE"},{"tcampo1":"ES0909    ","tcampo2":"VICTORIA - CABAÑAS"},{"tcampo1":"ES1325    ","tcampo2":"YAMABAL - MORAZAN"},{"tcampo1":"ES1417    ","tcampo2":"YAYANTIQUE - LA UNION"},{"tcampo1":"ES1326    ","tcampo2":"YOLOAIQUIN - MORAZAN"},{"tcampo1":"ES1418    ","tcampo2":"YUCUAIQUIN - LA UNION"},{"tcampo1":"ES0801    ","tcampo2":"ZACATECOLUCA - LA PAZ"},{"tcampo1":"ES0522    ","tcampo2":"ZARAGOZA - LA LIBERTAD"}];

  constructor(private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    

    /*this.registerForm = this.formBuilder.group({
      'firstFormGroup': new FormGroup({
        'nit': new FormGroup(null,Validators.required),
        'nrc': new FormGroup(null,Validators.required),
        'RazonSocialPersonaJuridica': new FormGroup(null,Validators.required),
        'NombreComercialPersonaJuridica': new FormGroup(null,Validators.required),
      }),
      'secondFormGroup' : new FormGroup({
        'ApellidosPersonaNatural': new FormGroup(null,Validators.required),
        'NombresPersonaNatural': new FormGroup(null,Validators.required),
        'FechaNacimientoPersonaNatural': new FormGroup(null,Validators.required),
      })
    });*/

    this.firstFormGroup = this.formBuilder.group({
      nit: ['', Validators.required],
      nrc: ['', Validators.required],
      RazonSocialPersonaJuridica: ['',Validators.required],
      itemFilterCtrl1: ['',Validators.required],
      CorreoPersonaJuridica: ['',Validators.required, Validators.email],
      NoTelefonoFijo: [''],
      ImagenNIT: ['',Validators.required],
      ImagenNRC: ['',Validators.required],
      ImagenEscritura: ['',Validators.required],
      CodigoTipoEmpresa: ['',Validators.required],
      CodigoUbicacionGeografica: ['',Validators.required],
      NombreComercialPersonaJuridica: ['',Validators.required]
    });
    this.secondFormGroup = this.formBuilder.group({
      ApellidosPersonaNatural: ['', Validators.required],
      NombresPersonaNatural: ['', Validators.required],
      FechaNacimientoPersonaNatural: ['', Validators.required],
      SexoPersonalNatural: ['', Validators.required],
    });
    this.thirdFormGroup = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.fourthFormGroup = this.formBuilder.group({
      aceptado: [0,'']
    });
  }

  checkValue(event){
    if(event.checked){
      this.accepted =true
    }else{
      this.accepted = false
    }
 }

  public uploadFinishedNITEmp = (event) => {
    this.response = event;
    this.firstFormGroup.patchValue({
      ImagenNIT:  this.response.dbPath
    });     
  }

  public uploadFinishedNRCEmp = (event) => {
    this.response = event;
    this.firstFormGroup.patchValue({
      ImagenNIT:  this.response.dbPath
    });     
  }

  public uploadFinishedEscrituraEmp = (event) => {
    this.response = event;
    this.firstFormGroup.patchValue({
      ImagenNIT:  this.response.dbPath
    });     
  }

  private filterItems1() {
    if (!this.departments) {
      return;
    }
    // get the search keyword
    let search = this.itemFilterCtrl1.value;
    if (!search) {
      this.filteredItems1.next(this.departments.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredItems1.next(
      this.departments.filter(item1 => item1.tcampo2.toLowerCase().indexOf(search) > -1)
    );
  }

  protected setInitialValue() {
    // this.filteredItems
    //   .pipe(take(1), takeUntil(this._onDestroy))
    //   .subscribe(() => {
    //     this.singleSelect.compareWith = (a: Item, b: Item) => a && b && a.tcampo1 === b.tcampo1;
    //   });

      this.filteredItems1
      .pipe(take(1),takeUntil(this._onDestroy1))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.singleSelect1.compareWith = (a: Item, b: Item) => a && b && a.tcampo1 === b.tcampo1;
      });
  }

  ngOnDestroy() {
    // this._onDestroy.next();
    // this._onDestroy.complete();

    this._onDestroy1.next();
    this._onDestroy1.complete();

  }

  onSubmit(){
    if (this.firstFormGroup.valid && this.secondFormGroup.valid) {
      const data = {
        ...this.firstFormGroup.value,
        ...this.secondFormGroup.value,
        ...this.thirdFormGroup.value,
      };
      this.datosUsuario = {
        id: 1,
        fullname:"Usuario de prueba",
        username: "usuario",
        email: "usuario@corre.com",
        uuid: "ghghgfhfgh",
        token: "fgdfgdfgdfgfddf",
      };
      localStorage.setItem('PlanillaUser', JSON.stringify(this.datosUsuario));
      this.router.navigate(['/dashboard']);

      console.log(data)
    }
  }

}
