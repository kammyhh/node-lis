var mongodb = require('./db');
  markdown = require('markdown').markdown;

function Product(barcode, name, shortname, brand, description, model, spec,
                 weight, weightUnit, volume, volumeUnit, typeId, mainImgUrl,displayImgUuid) {
  this.barcode = barcode;
  this.name = name;
  this.shortname = shortname;
  this.brand = brand;
  this.description = description;
  this.model = model;
  this.spec = spec;
  this.weight = weight;
  this.weightUnit = weightUnit;
  this.volume = volume;
  this.volumeUnit = volumeUnit;
  this.typeId = typeId;
  this.mainImgUrl = mainImgUrl;
  this.displayImgUuid = displayImgUuid;
}
module.exports = Product;

//存储一个产品及其相关信息
Product.prototype.save = function(callback) {
  //要存入数据库的文档
  var product = {
    barcode: this.barcode,
    name: this.name,
    shortname: this.shortname,
    brand: this.brand,
    description: this.description,
    model: this.model,
    spec: this.spec,
    sale: {
      weight: this.weight,
      weightUnit: this.weightUnit,
      volume: this.volume,
      volumeUnit: this.volumeUnit
    },
    typeId: this.typeId,
    mainImgUrl: this.mainImgUrl,
    displayImgUuid: this.displayImgUuid
  };
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 products 集合
    db.collection('products', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //将文档插入 products 集合
      collection.insert(product, {
        safe: true
      }, function (err) {
        mongodb.close();
        if (err) {
          return callback(err);//失败！返回 err
        }
        callback(null, product[0]);//返回 err 为 null
      });
    });
  });
};

//读取文章及其相关信息
Product.get = function(name, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 products 集合
    db.collection('products', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      var query = {};
      if (name) {
        query.name = name;
      }
      //根据 query 对象查询商品
      collection.find(query).sort({
        name: -1
      }).toArray(function (err, products) {
        mongodb.close();
        if (err) {
          return callback(err);//失败！返回 err
        }
        callback(null, products);//成功！以数组形式返回查询的结果
      });
    });
  });
};

//更新一篇文章及其相关信息
Product.update = function(product, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('products', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //更新文章内容
      collection.update({
      }, {
        $set: {product: product}
      }, function (err) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    });
  });
};