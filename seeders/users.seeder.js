import { Seeder } from 'mongoose-data-seed';
import { Model } from '../src/models/User';

const data = [
  {
    "first_name" : "yellow",
    "last_name" : "green",
    "department" : {
        "_id" : "61f51270010e2d342cd5e6a9",
        "name" : "yellow yellow"
    },
    "role" : "ADMIN",
    "email" : "awet@gmail.com",
    "username" : "admindw2aw@gmail.com",
  },
];

class UsersSeeder extends Seeder {

  async shouldRun() {
    return Model.countDocuments().exec().then(count => count === 0);
  }

  async run() {
    return Model.create(data);
  }
}

export default UsersSeeder;
