const { Country } = require("./models/Country");
const { Activity } = require("./models/Activity");
const { Op } = require("sequelize");

//returns all countries || by partial name(optional) || [countrieA, countrieB, ...]
async function getCountriesTable(name) {
  try {
    if (name) name = name.toLowerCase();

    const allCountries = name
      ? await Country.findAll({
          where: {
            name: {
              [Op.like]: `%${name}%`,
            },
          },
          include: Activity,
        })
      : await Country.findAll({ include: Activity });

    const countries = allCountries.map(
      ({ name, flag_image, continent, population, activities }) => {
        return {
          name,
          flag_image,
          continent,
          population,
          activities,
        };
      }
    );
    return countries;
  } catch (e) {
    throw new Error(
      "Something went wrong when getting the countries from the database."
    );
  }
}

async function getMultipleCountries(countries = []) {
  try {
    countries = countries.map((country) => ({ name: country })); //[{name: "argentina"},{name:"brasil"}]

    const foundCountries = await Country.findAll({
      where: {
        [Op.or]: countries,
      },
    });

    return foundCountries;
  } catch (e) {
    throw new Error(
      "Something went wrong when requesting the countries in the database"
    );
  }
}

async function getCountryByIdOrName(idOrName) {
  try {
    if (idOrName) idOrName = idOrName.toLowerCase();

    const countryDetail = await Country.findOne({
      where: {
        [Op.or]: [{ id: idOrName }, { name: idOrName }],
      },
      include: Activity,
    });
    return countryDetail;
  } catch (e) {
    throw new Error(
      "Something went wrong trying to get the country by id from the database."
    );
  }
}

async function setActivity(activity) {
  try {
    const [act, created] = await Activity.findOrCreate({
      where: {
        name: activity.name,
      },
      defaults: {
        ...activity,
      },
    });
    return {
      act,
      created,
      message: created
        ? "The activity was added successfully."
        : "The activity already exists.",
    };
  } catch (e) {
    throw new Error(
      "Something went wrong while trying to create the activity."
    );
  }
}

module.exports = {
  getCountriesTable,
  getCountryByIdOrName,
  setActivity,
  getMultipleCountries,
};
