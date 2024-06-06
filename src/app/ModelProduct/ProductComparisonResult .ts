export class ProductComparisonResult {
    productId1: number;
    productId2: number;
    attributeName: string;
    attributeComparisonResult: string;
  
    constructor(productId1: number, productId2: number, attributeName: string, attributeComparisonResult: string) {
      this.productId1 = productId1;
      this.productId2 = productId2;
      this.attributeName = attributeName;
      this.attributeComparisonResult = attributeComparisonResult;
    }
  }
  