import { getTextContentFromHTMLString } from "@/app/common/convertStringHTML";
import { saveParseJSON } from "@/app/common/saveParseJSON";
import { transformLanguageData } from "@/app/common/transformDataResponse";
import { EKeyTranslations } from "@/interfaces/common";
import {
  IAdminProductListItem,
  IComposedProductCreationForm,
  IProductDetailResponse,
  IProductDetails,
  IProductItemDetail,
  IProductListItem,
  ISingleProductCreationForm,
  TProductEditRequestPayload,
} from "@/interfaces/product";

interface IComposedProductSubItem {
  id?: number | null;
  quantity: number;
  value: string;
  price: number;
  cost: number;
  imgUrl: string;
}

class ProductAPIAdapter {
  convertAPIListResponseToProductItem(
    product: IProductDetails
  ): IProductListItem {
    return {
      id: product.id,
      averageRating: product.starAverage || 0,
      marked: false,
      price: product.price,
      thumbnail: product.productUrl[0].url || "",
      title: product.name,
      totalRating: product?.rating?.length ?? 0,
    };
  }

  convertAPIDetailResponseToDetailProductItem(
    product: IProductDetailResponse
  ): IProductItemDetail {
    const describe = saveParseJSON(product.data.describe)[0] ?? {};
    const description = saveParseJSON(product.data.description)[0] ?? {};
    const information = saveParseJSON(product.data?.information)[0] ?? {};

    return {
      id: product.data.id,
      categories: [
        {
          id: product.data.category.id,
          name: JSON.parse(product.data.category.name),
          parentId: product.data.category.parentId,
        },
      ],
      isComposed: product.data.isComposed,
      images: product.data.productUrl
        .filter((url) => !!url.id)
        .map((prodUrl) => prodUrl.url),
      name: JSON.parse(product.data.name),
      sku: product.data.SKU,
      price: product.data.price,
      summaryDescription: describe,
      categoryId: product.data.categoryId,
      tags: (product.data.tag || "N/A").split(", "),
      description,
      information,
      rating: [],
      relatedProducts: [],
      productItem: product.data.productItem,
    };
  }

  convertAPIAdminListToProductListItem(
    data: IProductDetails
  ): IAdminProductListItem {
    return {
      id: data.id,
      SKU: data.SKU,
      name: data.name,
      price: data.price,
      status: data.status,
      sold: 10,
      inStock: data.productItem.reduce(
        (inStockAmount, item) => inStockAmount + item.quantity,
        0
      ),
      starAverage: Math.trunc((data.starAverage ?? 0) * 10) / 10,
      productUrl: data.productUrl,
      productItems: data.productItem,
      isComposed: data.isComposed,
    };
  }

  convertSingleProductCreateformToAPIPayload(
    form: ISingleProductCreationForm,
    isEdit = false
  ): TProductEditRequestPayload {
    const description = JSON.stringify({
      en: form.en.description.replaceAll('"', "'"),
      vi: form.vi.description.replaceAll('"', "'"),
    });

    const name = JSON.stringify({
      en: form.en.name.replaceAll('"', "'"),
      vi: form.vi.name.replaceAll('"', "'"),
    });

    return {
      id: (isEdit ? Number(form.subProductId) : Number(form.id)) || null,
      name,
      description,
      // information: `{"vi":"","en":""}`,
      describe: description,
      SKU: form.SKU,
      tag: (form.tags ?? "")
        .split(",")
        .map((item) => item.trim())
        .join(", "),
      categoryId: form.category,
      imageURL: form.uploadedImages,
      isComposed: false,
      price: Number(form.sellPrice),
      cost: Number(form.sellPrice),
      quantity: Number(form.inStock),
      itemImageUrl: form.uploadedImages?.[0] || "",
    };
  }

  convertComposedProductCreateFormToAPIPayload(
    form: IComposedProductCreationForm,
    isEdit = false
  ): TProductEditRequestPayload {
    const description = JSON.stringify({
      en: form.en.description.replaceAll('"', "'"),
      vi: form.vi.description.replaceAll('"', "'"),
    });

    const name = JSON.stringify({
      en: form.en.name.replaceAll('"', "'"),
      vi: form.vi.name.replaceAll('"', "'"),
    });

    return {
      id: Number(form.id) || null,
      name,
      description,
      // information: `{"vi":"${description}","en":"${description}"}`,
      describe: description,
      SKU: form.SKU,
      categoryId: form.category,
      tag: (form.tags ?? "")
        .split(",")
        .map((item) => item.trim())
        .join(", "),
      item: form.products.map((product) => {
        const result: IComposedProductSubItem = {
          quantity: Number(product.quantity),
          value: product.value,
          price: Number(product.price),
          cost: Number(product.price),
          imgUrl: product.imgUrl,
        };

        if (isEdit) {
          result.id = Number(product.id) || null;
        }

        return result;
      }),
      isComposed: true,
      imageURL: form.uploadedImages ?? [],
    };
  }

  convertDetailProductAdminAPIToProductData(
    data: IProductDetails
  ): ISingleProductCreationForm | IComposedProductCreationForm {
    const [name] = saveParseJSON(data.name);
    const [description] = saveParseJSON(data.description);

    if (data.isComposed) {
      return {
        id: String(data.id),
        en: {
          name: name.en ?? "",
          description: description.en ?? "",
        },
        vi: {
          name: name.vi ?? "",
          description: description.vi ?? "",
        },
        // name: transformLanguageData(lang, data.name),
        SKU: data.SKU,
        category: data.categoryId,
        // description: transformLanguageData(lang, data.description),
        brand: "",
        isComposedProduct: true,
        tags: data.tag ?? "",
        images: data.productUrl.map((item) => ({
          uid: String(item.id) || item.url,
          name: item.url,
          status: "done",
          url: item.url,
          thumbUrl: item.url,
        })),
        uploadedImages: data.productUrl
          .filter((url) => !!url.id)
          .map((url) => url.url),
        products: data.productItem.map((item) => ({
          id: String(item.id),
          value: item.value,
          quantity: String(item.quantity),
          price: String(item.price),
          cost: String(item.cost),
          imgUrl: item.imgUrl,
          images: [
            {
              uid: String(item.id),
              name: item.imgUrl,
              status: "done",
              url: item.imgUrl,
              thumbUrl: item.imgUrl,
            },
          ],
        })),
      };
    }

    const subProductItem = data.productItem[0];

    return {
      id: String(data.id),
      en: {
        name: name.en ?? "",
        description: description.en ?? "",
      },
      vi: {
        name: name.vi ?? "",
        description: description.vi ?? "",
      },
      // name: transformLanguageData(lang, data.name),
      SKU: data.SKU,
      category: data.categoryId,
      // description: transformLanguageData(lang, data.description),
      brand: "",
      tags: data.tag ?? "",
      isComposedProduct: false,
      images: data.productUrl
        .filter((url) => !!url.id)
        .map((item) => ({
          uid: String(item.id),
          name: item.url,
          status: "done",
          url: item.url,
          thumbUrl: item.url,
        })),
      sellPrice: String(subProductItem.price),
      inStock: String(subProductItem.quantity ?? 0),
      subProductId: String(subProductItem.id),
    };
  }
}

export const productAPIAdapter = new ProductAPIAdapter();
