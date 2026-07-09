const Car = require('../models/car.model');

/**
 * @desc Get all cars with pagination, filtering & sorting
 * @route GET /api/cars
 * @access Public
 */
const getCars = async (req, res, next) => {
  try {
    const {
      search,
      brand,
      brandSlug,
      category,
      bodyType,
      fuelType,
      transmission,
      seatingCapacity,
      seats,
      isElectric,
      isPopular,
      isLatest,
      isUpcoming,
      featured,
      condition,
      minPrice,
      maxPrice,
      minPower,
      maxPower,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const query = { isDeleted: { $ne: true } };

    // 1. Search (Autocomplete & Suggestions)
    if (search) {
      const isNumeric = !isNaN(search);
      if (isNumeric) {
        // Search by numeric value range for power/seats/year
        const numVal = Number(search);
        query.$or = [
          { power: { $gte: numVal - 50, $lte: numVal + 50 } },
          { seatingCapacity: numVal },
          { year: numVal }
        ];
      } else {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { modelName: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } },
          { overview: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { sellerCity: { $regex: search, $options: 'i' } }
        ];
      }
    }

    // 2. Exact Filters
    if (brand) {
      query.$or = [
        { brandSlug: brand.toLowerCase() },
        { brandId: brand.toLowerCase() },
        { brand: { $regex: new RegExp('^' + brand + '$', 'i') } }
      ];
    }
    if (brandSlug) query.brandSlug = brandSlug.toLowerCase();
    if (category) query.category = category;
    if (bodyType) query.bodyType = { $regex: new RegExp('^' + bodyType + '$', 'i') };
    if (fuelType) query.fuelType = fuelType.toUpperCase();
    if (transmission) query.transmission = transmission.toUpperCase();

    // Seating Cap
    const seatCount = seats || seatingCapacity;
    if (seatCount) query.seatingCapacity = Number(seatCount);

    // Boolean segments
    if (isElectric !== undefined) {
      if (isElectric === 'true') {
        query.$or = [{ fuelType: 'ELECTRIC' }, { isElectric: true }];
      }
    }
    if (isPopular !== undefined) query.isPopular = isPopular === 'true';
    if (isLatest !== undefined) query.isLatest = isLatest === 'true';
    if (isUpcoming !== undefined) query.isUpcoming = isUpcoming === 'true';
    if (featured !== undefined) query.featured = featured === 'true';
    if (condition) query.condition = condition.toUpperCase();

    // Price Bounds
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
    }

    // Power Bounds
    if (minPower !== undefined || maxPower !== undefined) {
      query.power = {};
      if (minPower !== undefined) query.power.$gte = Number(minPower);
      if (maxPower !== undefined) query.power.$lte = Number(maxPower);
    }

    // 3. Sorting Options
    let sortOptions = {};
    if (sort === 'price_asc' || sort === 'price-asc') {
      sortOptions = { price: 1 };
    } else if (sort === 'price_desc' || sort === 'price-desc') {
      sortOptions = { price: -1 };
    } else if (sort === 'mileage_asc' || sort === 'mileage-asc') {
      sortOptions = { mileage: 1 };
    } else if (sort === 'newest') {
      sortOptions = { year: -1, createdAt: -1 };
    } else {
      sortOptions = { id: 1 }; // default sorting
    }

    // 4. Pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Car.countDocuments(query);
    const cars = await Car.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      message: 'Cars retrieved successfully',
      data: {
        bikes: cars, // alias to prevent frontend parse crashes
        cars,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum)
        }
      },
      errors: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get car details by slug
 * @route GET /api/cars/:slug
 * @access Public
 */
const getCarDetails = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const query = { slug: slug.toLowerCase(), isDeleted: { $ne: true } };

    const car = await Car.findOne(query);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car model not found',
        data: null,
        errors: ['Vehicle not found']
      });
    }

    res.status(200).json({
      success: true,
      message: 'Car details retrieved successfully',
      data: car,
      errors: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Create new car
 * @route POST /api/cars
 * @access Private (Admin)
 */
const createCar = async (req, res, next) => {
  try {
    const carData = req.body;

    // Increment numeric ID
    const lastCar = await Car.findOne().sort({ id: -1 });
    const nextId = lastCar && lastCar.id ? lastCar.id + 1 : 1;
    carData.id = nextId;

    // Generate slug auto from brand and modelName if missing
    if (!carData.slug) {
      let slugBase = `${carData.brand}-${carData.modelName}-${carData.variant || ''}`;
      carData.slug = slugBase.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    // Validate slug uniqueness, appending suffix if duplicate exists
    let uniqueSlug = carData.slug;
    let counter = 2;
    while (await Car.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${carData.slug}-${counter}`;
      counter++;
    }
    carData.slug = uniqueSlug;

    // Enforce category
    carData.category = 'car';

    const car = await Car.create(carData);

    res.status(201).json({
      success: true,
      message: 'Car created successfully',
      data: car,
      errors: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update car details
 * @route PUT /api/cars/:id
 * @access Private (Admin)
 */
const updateCar = async (req, res, next) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
        data: null,
        errors: ['Car not found']
      });
    }

    res.status(200).json({
      success: true,
      message: 'Car updated successfully',
      data: car,
      errors: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete car (soft delete)
 * @route DELETE /api/cars/:id
 * @access Private (Admin)
 */
const deleteCar = async (req, res, next) => {
  try {
    // Perform soft delete by default as requested in VEHICLE MANAGEMENT
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
        data: null,
        errors: ['Car not found']
      });
    }

    res.status(200).json({
      success: true,
      message: 'Car deleted successfully',
      data: {},
      errors: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Duplicate car listing
 * @route POST /api/cars/:id/duplicate
 * @access Private (Admin)
 */
const duplicateCar = async (req, res, next) => {
  try {
    const originalCar = await Car.findById(req.params.id);
    if (!originalCar) {
      return res.status(404).json({
        success: false,
        message: 'Car to duplicate not found',
        data: null,
        errors: ['Original car not found']
      });
    }

    const carData = originalCar.toObject();
    delete carData._id;
    delete carData.createdAt;
    delete carData.updatedAt;

    // Setup new ID
    const lastCar = await Car.findOne().sort({ id: -1 });
    carData.id = lastCar && lastCar.id ? lastCar.id + 1 : 1;

    // Modify Title/Slug to reflect copy
    carData.modelName = `${carData.modelName} (Copy)`;
    if (carData.title) carData.title = `${carData.title} (Copy)`;
    
    let baseSlug = `${carData.slug}-copy`;
    let uniqueSlug = baseSlug;
    let counter = 2;
    while (await Car.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    carData.slug = uniqueSlug;

    const newCar = await Car.create(carData);

    res.status(201).json({
      success: true,
      message: 'Car duplicated successfully',
      data: newCar,
      errors: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Bulk Publish listings
 * @route POST /api/cars/bulk-publish
 * @access Private (Admin)
 */
const bulkPublish = async (req, res, next) => {
  try {
    const { ids } = req.body; // array of Mongo IDs
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({
        success: false,
        message: 'Bulk publish failed',
        data: null,
        errors: ['Invalid ids array']
      });
    }

    await Car.updateMany(
      { _id: { $in: ids } },
      { status: 'APPROVED' } // Approved / published status
    );

    res.status(200).json({
      success: true,
      message: 'Bulk listings published successfully',
      data: {},
      errors: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Bulk Draft listings
 * @route POST /api/cars/bulk-draft
 * @access Private (Admin)
 */
const bulkDraft = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({
        success: false,
        message: 'Bulk draft failed',
        data: null,
        errors: ['Invalid ids array']
      });
    }

    await Car.updateMany(
      { _id: { $in: ids } },
      { status: 'PENDING' } // Pending / draft status
    );

    res.status(200).json({
      success: true,
      message: 'Bulk listings drafted successfully',
      data: {},
      errors: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Bulk Delete listings
 * @route POST /api/cars/bulk-delete
 * @access Private (Admin)
 */
const bulkDelete = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({
        success: false,
        message: 'Bulk delete failed',
        data: null,
        errors: ['Invalid ids array']
      });
    }

    await Car.updateMany(
      { _id: { $in: ids } },
      { isDeleted: true }
    );

    res.status(200).json({
      success: true,
      message: 'Bulk listings deleted successfully',
      data: {},
      errors: null
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCars,
  getCarDetails,
  createCar,
  updateCar,
  deleteCar,
  duplicateCar,
  bulkPublish,
  bulkDraft,
  bulkDelete
};
