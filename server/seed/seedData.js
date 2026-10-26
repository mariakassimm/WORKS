const placeholder = (seed) => ({
  url: `https://placehold.co/1200x900/14161a/f5f5f0?text=${encodeURIComponent(seed)}`,
  publicId: null,
  isMain: true,
});

const parts = [
  { name: "Front Bumper Assembly", category: "Body Parts", price: 8500, vehicleMake: "Toyota", vehicleModel: "Corolla", compatibleYears: "2014 - 2019", shortDescription: "Clean used front bumper, minor surface scuffs.", description: "Genuine used front bumper assembly in solid structural condition with minor surface scuffs consistent with age. Mounting tabs intact, ready to paint and fit." },
  { name: "Rear Bumper Cover", category: "Body Parts", price: 7200, vehicleMake: "Honda", vehicleModel: "Civic", compatibleYears: "2016 - 2021", shortDescription: "Straight panel, no cracks.", description: "Straight rear bumper cover pulled from a low-mileage donor vehicle. No cracks or repairs, small scratch on lower edge." },
  { name: "Driver Side Door Shell", category: "Body Parts", price: 12500, vehicleMake: "Suzuki", vehicleModel: "Mehran", compatibleYears: "2005 - 2012", shortDescription: "Bare shell, no dents.", description: "Driver side front door shell, bare metal with no major dents. Glass and trim not included." },
  { name: "Bonnet / Hood Panel", category: "Body Parts", price: 9800, vehicleMake: "Honda", vehicleModel: "City", compatibleYears: "2009 - 2013", shortDescription: "Factory hood, light overspray.", description: "Factory steel hood panel, light overspray from previous respray, no dents or rust." },
  { name: "Headlight Assembly (Right)", category: "Electrical", price: 4600, vehicleMake: "Toyota", vehicleModel: "Vitz", compatibleYears: "2010 - 2017", shortDescription: "Clear lens, tested working.", description: "Right-side headlight assembly with clear, unclouded lens. Tested and confirmed fully functional before listing." },
  { name: "Headlight Assembly (Left)", category: "Electrical", price: 4600, vehicleMake: "Toyota", vehicleModel: "Vitz", compatibleYears: "2010 - 2017", shortDescription: "Matching pair available.", description: "Left-side headlight assembly, matching pair to the right unit also in stock. Clean lens, tested working." },
  { name: "LED Tail Light Set", category: "Electrical", price: 6200, vehicleMake: "Suzuki", vehicleModel: "Swift", compatibleYears: "2017 - 2023", shortDescription: "Pair, both tested.", description: "Complete tail light pair, LED elements tested and confirmed working on both sides. Housing free of cracks." },
  { name: "Alternator", category: "Engine Parts", price: 5400, vehicleMake: "Honda", vehicleModel: "Civic", compatibleYears: "2006 - 2011", shortDescription: "Bench-tested, charges correctly.", description: "Used alternator, bench-tested under load and confirmed to charge within spec. Pulley and bracket included." },
  { name: "Starter Motor", category: "Engine Parts", price: 4100, vehicleMake: "Toyota", vehicleModel: "Corolla", compatibleYears: "2008 - 2013", shortDescription: "Tested, cranks strong.", description: "Used starter motor tested on the bench, cranks strong with no unusual noise. Direct fit for listed years." },
  { name: "Radiator (Complete)", category: "Cooling", price: 6800, vehicleMake: "Suzuki", vehicleModel: "Cultus", compatibleYears: "2007 - 2016", shortDescription: "Pressure-tested, no leaks.", description: "Complete radiator assembly, pressure-tested with no leaks found. Fins straight, both tanks intact." },
  { name: "Cooling Fan Assembly", category: "Cooling", price: 3900, vehicleMake: "Honda", vehicleModel: "City", compatibleYears: "2009 - 2015", shortDescription: "Motor tested, spins freely.", description: "Radiator cooling fan with motor, tested and spins freely with no wobble. Shroud included." },
  { name: "Water Pump", category: "Cooling", price: 2600, vehicleMake: "Toyota", vehicleModel: "Yaris", compatibleYears: "2011 - 2018", shortDescription: "No play in bearing.", description: "Used water pump removed from a running engine, no play in the bearing and impeller intact." },
  { name: "Engine Mount Set", category: "Engine Parts", price: 3300, vehicleMake: "Suzuki", vehicleModel: "Mehran", compatibleYears: "2000 - 2012", shortDescription: "Rubber intact, no tears.", description: "Set of engine mounts, rubber bushings intact with no visible tears or excessive sag." },
  { name: "Timing Chain Kit", category: "Engine Parts", price: 5200, vehicleMake: "Honda", vehicleModel: "Civic", compatibleYears: "2012 - 2017", shortDescription: "Chain, tensioner, guides.", description: "Complete timing chain kit including chain, tensioner and guide rails, removed from a low-mileage engine." },
  { name: "Automatic Transmission (Used)", category: "Transmission", price: 45000, vehicleMake: "Toyota", vehicleModel: "Corolla", compatibleYears: "2010 - 2016", shortDescription: "Shifts smooth, no slipping.", description: "Complete automatic transmission unit, road-tested prior to removal — shifts smoothly through all gears with no slipping." },
  { name: "Manual Gearbox", category: "Transmission", price: 32000, vehicleMake: "Suzuki", vehicleModel: "Swift", compatibleYears: "2011 - 2020", shortDescription: "All gears engage cleanly.", description: "5-speed manual gearbox, all gears engage cleanly with no grinding. Clutch not included." },
  { name: "CV Axle (Front Right)", category: "Transmission", price: 4200, vehicleMake: "Honda", vehicleModel: "City", compatibleYears: "2009 - 2015", shortDescription: "Boots intact, no clicking.", description: "Front right CV axle, boots intact with no cracking. No clicking noise on inspection." },
  { name: "Front Strut Assembly (Pair)", category: "Suspension", price: 8900, vehicleMake: "Toyota", vehicleModel: "Vitz", compatibleYears: "2010 - 2017", shortDescription: "No leaks, good rebound.", description: "Pair of front strut assemblies, no fluid leaks and good rebound when tested by hand." },
  { name: "Rear Shock Absorbers (Pair)", category: "Suspension", price: 5600, vehicleMake: "Suzuki", vehicleModel: "Cultus", compatibleYears: "2007 - 2016", shortDescription: "Firm, no oil seepage.", description: "Pair of rear shock absorbers, still firm with no visible oil seepage on the shaft." },
  { name: "Control Arm (Lower, Left)", category: "Suspension", price: 3100, vehicleMake: "Honda", vehicleModel: "Civic", compatibleYears: "2012 - 2017", shortDescription: "Bushings in good shape.", description: "Lower left control arm, bushings and ball joint in good working condition, no excess play." },
  { name: "Stabilizer / Sway Bar", category: "Suspension", price: 2400, vehicleMake: "Toyota", vehicleModel: "Corolla", compatibleYears: "2008 - 2013", shortDescription: "Straight, no bends.", description: "Front stabilizer bar, straight with no bends and mounting bushings still attached." },
  { name: "Brake Caliper (Front, Right)", category: "Brakes", price: 3700, vehicleMake: "Honda", vehicleModel: "City", compatibleYears: "2009 - 2015", shortDescription: "Piston moves freely.", description: "Front right brake caliper, piston moves freely with no seizing. Bled and tested before removal." },
  { name: "Brake Disc Set (Front, Pair)", category: "Brakes", price: 4300, vehicleMake: "Suzuki", vehicleModel: "Swift", compatibleYears: "2017 - 2023", shortDescription: "Within wear limits.", description: "Pair of front brake discs, measured within safe wear limits, no visible scoring." },
  { name: "Master Cylinder", category: "Brakes", price: 2900, vehicleMake: "Toyota", vehicleModel: "Yaris", compatibleYears: "2011 - 2018", shortDescription: "No internal leaks.", description: "Brake master cylinder, tested for internal leaks with none found. Reservoir cap included." },
  { name: "Handbrake Lever Assembly", category: "Brakes", price: 1800, vehicleMake: "Suzuki", vehicleModel: "Mehran", compatibleYears: "2000 - 2012", shortDescription: "Ratchet holds firm.", description: "Handbrake lever assembly, ratchet mechanism holds firm with no slipping." },
  { name: "Wiring Harness (Engine Bay)", category: "Electrical", price: 5100, vehicleMake: "Honda", vehicleModel: "Civic", compatibleYears: "2006 - 2011", shortDescription: "All connectors intact.", description: "Engine bay wiring harness, all connectors intact and continuity-checked before listing." },
  { name: "ECU / Engine Control Unit", category: "Electrical", price: 9200, vehicleMake: "Toyota", vehicleModel: "Corolla", compatibleYears: "2010 - 2016", shortDescription: "Pulled from running car.", description: "ECU pulled from a running, driving vehicle. Sold as-is; please confirm part number match before purchase." },
  { name: "Power Window Regulator", category: "Electrical", price: 2200, vehicleMake: "Suzuki", vehicleModel: "Cultus", compatibleYears: "2007 - 2016", shortDescription: "Motor runs smoothly.", description: "Power window regulator with motor, tested to run smoothly through full travel." },
  { name: "Front Seat (Driver Side)", category: "Interior", price: 6500, vehicleMake: "Honda", vehicleModel: "City", compatibleYears: "2009 - 2015", shortDescription: "Fabric clean, frame solid.", description: "Driver side front seat, fabric upholstery clean with no tears, frame and rails solid." },
  { name: "Dashboard Instrument Cluster", category: "Interior", price: 3800, vehicleMake: "Toyota", vehicleModel: "Vitz", compatibleYears: "2010 - 2017", shortDescription: "All gauges tested working.", description: "Instrument cluster, tested on the bench — all gauges and warning lights functioning correctly." },
  { name: "Center Console Assembly", category: "Interior", price: 2700, vehicleMake: "Suzuki", vehicleModel: "Swift", compatibleYears: "2017 - 2023", shortDescription: "No cracks, cup holders intact.", description: "Center console assembly, plastic free of cracks, cup holders and storage compartment intact." },
  { name: "Side Mirror (Right, Power)", category: "Exterior", price: 2900, vehicleMake: "Honda", vehicleModel: "Civic", compatibleYears: "2012 - 2017", shortDescription: "Folds and adjusts electrically.", description: "Right-side power-folding mirror, motor confirmed working for both fold and adjustment functions." },
  { name: "Alloy Wheel (16-inch)", category: "Exterior", price: 8200, vehicleMake: "Toyota", vehicleModel: "Corolla", compatibleYears: "2014 - 2019", shortDescription: "Straight, no cracks or bends.", description: "16-inch alloy wheel, checked straight with no cracks or bends. Minor curb rash on outer lip." },
];

const buildProducts = () =>
  parts.map((p, idx) => ({
    ...p,
    images: [placeholder(p.name)],
    condition: idx % 9 === 0 ? "refurbished" : "used",
    availability: idx % 11 === 0 ? "reserved" : "in_stock",
    featured: idx % 6 === 0,
    isPublished: true,
    specifications: [
      { label: "Condition Grade", value: idx % 3 === 0 ? "A - Excellent" : "B - Good" },
      { label: "Origin", value: "Genuine OEM" },
    ],
  }));

module.exports = buildProducts;
