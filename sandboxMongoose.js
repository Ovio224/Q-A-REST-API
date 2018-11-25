'use strict';

const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/sandbox", {
  useNewUrlParser: true
});

const db = mongoose.connection;

db.on('error', (err) => {
  console.error("connection error:" + err);
});

db.once('open', () => {
  console.log("Connection to the db was succesesful");
  // DB communication

  const Schema = mongoose.Schema;
  const AnimalSchema = new Schema({
    type: {
      type: String,
      default: "goldfish"
    },
    size: String,
    color: {
      type: String,
      default: "golden"
    },
    mass: {
      type: Number,
      default: 0.07
    },
    name: {
      type: String,
      default: "Angela"
    }
  });

  AnimalSchema.pre("save", function(next){
    if (this.mass >= 100) {
      this.size = "big";

    } else if (this.mass >= 5 && this.mass < 100) {
      this.size = "medium";
    } else {
      this.size = "small";
    }
    next();
  });

  AnimalSchema.statics.findSize = function(size, callback) {
    // this == Animal model
    return this.find({size: size}, callback);
  }

  AnimalSchema.methods.findSameColor = function(callback) {
    // this == document
    return this.model("Animal").find({color: this.color}, callback);
  }

  const Animal = mongoose.model("Animal", AnimalSchema);

  const elephant = new Animal({
    type: "elephant",
    color: "grey",
    mass: 4000,
    name: "Lawrence"
  });

  const animal = new Animal({}); // goldfish

  const whale = new Animal({
    type: "whale",
    mass: 190500,
    name: "Moby"
  });

  const animalData = [{
      type: "mouse",
      color: "grey",
      mass: 0.035,
      name: "Marvin"
    },
    {
      type: "nutria",
      color: "brown",
      mass: 6.35,
      name: "Gretchen"
    },
    {
      type: "wolf",
      color: "grey",
      mass: 45,
      name: "Iris"
    },
    elephant,
    animal,
    whale
  ];

  Animal.remove({}, (err) => { // deprecated
    if (err) console.error("err", err);
    Animal.create(animalData, (err, animals) => {
      if (err) console.error("err", err);
      Animal.findOne({type: "elephant"}, (err, elephant) => {
        elephant.findSameColor(function(err, animals){
            animals.forEach((animal) => {
              console.log(animal.name + " the " + animal.color + " " + animal.type + " is " + animal.size);
            });
            db.close(() => {
              console.log("db connection closed")
          });
        }); // use promises please
      }); // end find
    }); // end create 
  }); // end remove

});