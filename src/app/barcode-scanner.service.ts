import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BrowserBarcodeReader } from '@zxing/library';
import{ProductDetailsDialogComponent} from "./product-details-dialog/product-details-dialog.component";
import { MiscService } from 'src/app/Service/misc.service';

@Injectable({
    providedIn: 'root'
})
export class BarcodeScannerService {
    private apiUrl = 'http://localhost:8081/RestController/lookup';
    private apiUrl2 = 'http://localhost:8081/RestController/ScanBarcode';

    Boycote:boolean=false;

    private scanner: BrowserBarcodeReader;
    imageUrl: string;

    constructor(private http: HttpClient,private dialog: MatDialog,private miscService:MiscService) {
        this.scanner = new BrowserBarcodeReader();
    }

    scanBarcode(): Promise<string> {

        return this.scanner.decodeOnceFromVideoDevice(undefined, 'video').then(result => result.getText());
    }

    getProductDetailsFromScannedBarcode(): Promise<any> {
        return this.scanBarcode().then(barcode => {
            const url = `${this.apiUrl2}?barcode=${barcode}`;
            console.log(barcode);
            return this.http.get(url).toPromise().then(productDetails => {
                console.log("productDetails in get ProductDetails : " , productDetails);
                if(barcode.startsWith("401") )this.Boycote=true;

                this.openProductDetailsPopup(productDetails);
            });
        });
    }

    openProductDetailsPopup(productDetails: any): void {
        console.log("name : " , productDetails.dishes[0].name)

        const boycote = this.Boycote;

        const product = productDetails;
        console.log("product in openDialog : ", productDetails)

        this.dialog.open(ProductDetailsDialogComponent, {
            width: '400px',
            data: { productDetails,boycote } // pass imageUrl as part of the data object
        });
    }

    search(name:string) {
        console.log("in search");
        this.miscService.searchImage(name).subscribe(
            response => {
                console.log("response : ", response);
                const imageUrl = response.url;
                console.log("Image URL:", imageUrl);
                this.imageUrl = imageUrl;
                console.log(this.imageUrl);
            },
            error => {
                console.error('Error fetching image:', error);
            }
        );
        console.log("in error ", this.imageUrl);
    }
}

