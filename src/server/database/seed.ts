import bcrypt from 'bcryptjs';
import { DatabaseSchema } from './types.ts';

// Pre-computed bcrypt hashes for "Admin123!" and "Customer123!" to ensure instant seed initialization
const ADMIN_HASH = bcrypt.hashSync('Admin123!', 10);
const CUSTOMER_HASH = bcrypt.hashSync('Customer123!', 10);

export const initialSeedData: DatabaseSchema = {
  users: [
    {
      id: 'usr_superadmin',
      name: 'Edward Sterling',
      email: 'admin@customcarmats.co.uk',
      passwordHash: ADMIN_HASH,
      role: 'super_admin',
      phone: '+44 800 123 4567',
      createdAt: '2025-01-10T09:00:00.000Z',
      updatedAt: '2025-01-10T09:00:00.000Z'
    },
    {
      id: 'usr_content_mgr',
      name: 'Sophie Cartwright',
      email: 'editor@customcarmats.co.uk',
      passwordHash: ADMIN_HASH,
      role: 'content_manager',
      phone: '+44 800 123 4568',
      createdAt: '2025-01-12T10:00:00.000Z',
      updatedAt: '2025-01-12T10:00:00.000Z'
    },
    {
      id: 'usr_order_mgr',
      name: 'Oliver Hughes',
      email: 'orders@customcarmats.co.uk',
      passwordHash: ADMIN_HASH,
      role: 'order_manager',
      phone: '+44 800 123 4569',
      createdAt: '2025-01-15T11:00:00.000Z',
      updatedAt: '2025-01-15T11:00:00.000Z'
    },
    {
      id: 'usr_customer_demo',
      name: 'James Reynolds',
      email: 'customer@example.co.uk',
      passwordHash: CUSTOMER_HASH,
      role: 'customer',
      phone: '+44 7700 900123',
      addresses: [
        {
          id: 'addr_1',
          isDefault: true,
          addressType: 'shipping',
          line1: '14 Parkside Gardens',
          line2: 'Clifton',
          city: 'Bristol',
          county: 'Somerset',
          postcode: 'BS8 4LJ',
          country: 'United Kingdom'
        }
      ],
      loyaltyPoints: 345,
      pointsHistory: [
        {
          id: 'pts_1',
          date: '2025-02-14T10:15:00.000Z',
          points: 218,
          type: 'earned',
          description: 'Earned 5 pts per £1 on bespoke BMW 3 Series mats',
          orderNumber: 'CCM-10842'
        },
        {
          id: 'pts_2',
          date: '2025-02-01T14:30:00.000Z',
          points: 127,
          type: 'earned',
          description: 'Welcome bonus: Joined Custom Car Mats VIP Club'
        }
      ],
      wishlist: ['prod_1'],
      createdAt: '2025-02-01T14:30:00.000Z',
      updatedAt: '2025-02-01T14:30:00.000Z'
    }
  ],

  makes: [
    { id: 'make_bmw', name: 'BMW', slug: 'bmw', popular: true },
    { id: 'make_audi', name: 'Audi', slug: 'audi', popular: true },
    { id: 'make_mercedes', name: 'Mercedes-Benz', slug: 'mercedes-benz', popular: true },
    { id: 'make_vw', name: 'Volkswagen', slug: 'volkswagen', popular: true },
    { id: 'make_ford', name: 'Ford', slug: 'ford', popular: true },
    { id: 'make_tesla', name: 'Tesla', slug: 'tesla', popular: true },
    { id: 'make_landrover', name: 'Land Rover', slug: 'land-rover', popular: true },
    { id: 'make_vauxhall', name: 'Vauxhall', slug: 'vauxhall', popular: true },
    { id: 'make_toyota', name: 'Toyota', slug: 'toyota', popular: true },
    { id: 'make_nissan', name: 'Nissan', slug: 'nissan', popular: true }
  ],

  models: [
    // BMW
    { id: 'model_bmw_3', makeId: 'make_bmw', name: '3 Series', slug: '3-series', generation: 'G20 / F30 / E90' },
    { id: 'model_bmw_1', makeId: 'make_bmw', name: '1 Series', slug: '1-series', generation: 'F40 / F20' },
    { id: 'model_bmw_5', makeId: 'make_bmw', name: '5 Series', slug: '5-series', generation: 'G30 / G60' },
    { id: 'model_bmw_x5', makeId: 'make_bmw', name: 'X5', slug: 'x5', generation: 'G05 / F15' },

    // Audi
    { id: 'model_audi_a3', makeId: 'make_audi', name: 'A3', slug: 'a3', generation: '8Y / 8V' },
    { id: 'model_audi_a4', makeId: 'make_audi', name: 'A4', slug: 'a4', generation: 'B9 / B8' },
    { id: 'model_audi_q5', makeId: 'make_audi', name: 'Q5', slug: 'q5', generation: 'FY / 8R' },

    // Mercedes
    { id: 'model_merc_a', makeId: 'make_mercedes', name: 'A-Class', slug: 'a-class', generation: 'W177 / W176' },
    { id: 'model_merc_c', makeId: 'make_mercedes', name: 'C-Class', slug: 'c-class', generation: 'W206 / W205' },
    { id: 'model_merc_e', makeId: 'make_mercedes', name: 'E-Class', slug: 'e-class', generation: 'W213 / W214' },

    // VW
    { id: 'model_vw_golf', makeId: 'make_vw', name: 'Golf', slug: 'golf', generation: 'Mk8 / Mk7' },
    { id: 'model_vw_polo', makeId: 'make_vw', name: 'Polo', slug: 'polo', generation: 'Mk6' },
    { id: 'model_vw_tiguan', makeId: 'make_vw', name: 'Tiguan', slug: 'tiguan', generation: 'Mk2 / Mk3' },

    // Ford
    { id: 'model_ford_focus', makeId: 'make_ford', name: 'Focus', slug: 'focus', generation: 'Mk4 / Mk3' },
    { id: 'model_ford_fiesta', makeId: 'make_ford', name: 'Fiesta', slug: 'fiesta', generation: 'Mk8 / Mk7' },
    { id: 'model_ford_puma', makeId: 'make_ford', name: 'Puma', slug: 'puma', generation: '2019-Present' },

    // Tesla
    { id: 'model_tesla_m3', makeId: 'make_tesla', name: 'Model 3', slug: 'model-3', generation: 'Highland / Standard' },
    { id: 'model_tesla_my', makeId: 'make_tesla', name: 'Model Y', slug: 'model-y', generation: '2021-Present' },

    // Land Rover
    { id: 'model_lr_evoque', makeId: 'make_landrover', name: 'Range Rover Evoque', slug: 'range-rover-evoque', generation: 'L551 / L538' },
    { id: 'model_lr_sport', makeId: 'make_landrover', name: 'Range Rover Sport', slug: 'range-rover-sport', generation: 'L461 / L494' },

    // Vauxhall
    { id: 'model_vaux_corsa', makeId: 'make_vauxhall', name: 'Corsa', slug: 'corsa', generation: 'Corsa F / E' },
    { id: 'model_vaux_astra', makeId: 'make_vauxhall', name: 'Astra', slug: 'astra', generation: 'Astra L / K' },

    // Toyota
    { id: 'model_toyota_yaris', makeId: 'make_toyota', name: 'Yaris', slug: 'yaris', generation: 'Mk4 / Cross' },
    { id: 'model_toyota_corolla', makeId: 'make_toyota', name: 'Corolla', slug: 'corolla', generation: 'E210' },

    // Nissan
    { id: 'model_nissan_qashqai', makeId: 'make_nissan', name: 'Qashqai', slug: 'qashqai', generation: 'J12 / J11' }
  ],

  years: [
    // BMW 3 Series
    { id: 'yr_bmw3_1', modelId: 'model_bmw_3', yearRange: '2019 - Present (G20/G21)', startYear: 2019, endYear: 2026 },
    { id: 'yr_bmw3_2', modelId: 'model_bmw_3', yearRange: '2012 - 2018 (F30/F31)', startYear: 2012, endYear: 2018 },
    { id: 'yr_bmw3_3', modelId: 'model_bmw_3', yearRange: '2005 - 2011 (E90/E91)', startYear: 2005, endYear: 2011 },

    // BMW 1 Series
    { id: 'yr_bmw1_1', modelId: 'model_bmw_1', yearRange: '2019 - Present (F40)', startYear: 2019, endYear: 2026 },
    { id: 'yr_bmw1_2', modelId: 'model_bmw_1', yearRange: '2011 - 2019 (F20/F21)', startYear: 2011, endYear: 2019 },

    // Audi A3
    { id: 'yr_audi3_1', modelId: 'model_audi_a3', yearRange: '2020 - Present (8Y)', startYear: 2020, endYear: 2026 },
    { id: 'yr_audi3_2', modelId: 'model_audi_a3', yearRange: '2012 - 2020 (8V)', startYear: 2012, endYear: 2020 },

    // Mercedes A-Class
    { id: 'yr_merca_1', modelId: 'model_merc_a', yearRange: '2018 - Present (W177)', startYear: 2018, endYear: 2026 },
    { id: 'yr_merca_2', modelId: 'model_merc_a', yearRange: '2012 - 2018 (W176)', startYear: 2012, endYear: 2018 },

    // VW Golf
    { id: 'yr_vwg_1', modelId: 'model_vw_golf', yearRange: '2020 - Present (Mk8)', startYear: 2020, endYear: 2026 },
    { id: 'yr_vwg_2', modelId: 'model_vw_golf', yearRange: '2012 - 2020 (Mk7)', startYear: 2012, endYear: 2020 },

    // Tesla Model 3
    { id: 'yr_tm3_1', modelId: 'model_tesla_m3', yearRange: '2023 - Present (Highland)', startYear: 2023, endYear: 2026 },
    { id: 'yr_tm3_2', modelId: 'model_tesla_m3', yearRange: '2017 - 2023', startYear: 2017, endYear: 2023 }
  ],

  variants: [
    { id: 'var_bmw3_saloon', modelId: 'model_bmw_3', name: 'Saloon (4-Door)', clipType: 'BMW OEM Twist-Lock Peg (2-Floor)' },
    { id: 'var_bmw3_estate', modelId: 'model_bmw_3', name: 'Touring / Estate (5-Door)', clipType: 'BMW OEM Twist-Lock Peg' },
    { id: 'var_bmw3_msport', modelId: 'model_bmw_3', name: 'M Sport Edition (Tailored Fit)', clipType: 'BMW OEM Twist-Lock Peg' },
    { id: 'var_audi3_sportback', modelId: 'model_audi_a3', name: 'Sportback (5-Door)', clipType: 'Audi Push-Button Round Clip' },
    { id: 'var_audi3_saloon', modelId: 'model_audi_a3', name: 'Saloon (4-Door)', clipType: 'Audi Push-Button Round Clip' },
    { id: 'var_merca_hatch', modelId: 'model_merc_a', name: 'Hatchback', clipType: 'Mercedes Oval Eyelet Clip' },
    { id: 'var_vwg_hatch', modelId: 'model_vw_golf', name: 'Hatchback (Standard & GTI/R)', clipType: 'VW Round Push Pin Clip' },
    { id: 'var_tesla3_std', modelId: 'model_tesla_m3', name: 'Standard / Long Range / Performance', clipType: 'Tesla Direct Floor Hook Anchors' }
  ],

  materials: [
    {
      id: 'mat_standard',
      name: 'Standard Tufted Carpet',
      code: 'STD-650',
      badge: 'Popular Everyday',
      weightGsm: 650,
      description: 'Durable automotive-grade ribbed tufted carpet with granular anti-slip backing. Ideal for reliable daily commuters.',
      durability: '3-Year Wear Rating',
      priceModifier: 0,
      color: '#1F2937',
      imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'mat_luxury',
      name: 'Luxury Deep Pile Carpet',
      code: 'LUX-850',
      badge: 'Best Seller',
      weightGsm: 850,
      description: 'Plush, dense twist pile woven with premium polyamid fibres. Provides exceptional sound dampening, cushion, and elegance.',
      durability: '5-Year Wear Rating',
      priceModifier: 15,
      color: '#111827',
      imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'mat_prestige',
      name: 'Prestige Executive Velour',
      code: 'PRE-1200',
      badge: 'OEM Match Luxury',
      weightGsm: 1200,
      description: 'Our thickest, most opulent British-manufactured velour carpet. Surpasses original factory showroom grade with ultra-soft handfeel.',
      durability: 'Lifetime Workmanship Rating',
      priceModifier: 35,
      color: '#030712',
      imageUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'mat_rubber',
      name: 'Heavy Duty 3mm All-Weather Rubber',
      code: 'RUB-HD',
      badge: '100% Waterproof',
      weightGsm: 2100,
      description: 'Commercial-grade odourless natural rubber engineered with deep dish spill channels. Impervious to British mud, rain, salt, and snow.',
      durability: 'Heavy Commercial Grade',
      priceModifier: 10,
      color: '#0F172A',
      imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'mat_diamond',
      name: 'Diamond Quilted Luxury Faux Leather',
      code: 'DIA-ROYAL',
      badge: 'Ultra Prestige',
      weightGsm: 1600,
      description: 'Triple-layer hand-quilted composite with waterproof core and luxury diamond stitching. Transforms your vehicle footwell into a private jet cabin.',
      durability: 'Luxury Showpiece Grade',
      priceModifier: 50,
      color: '#18181B',
      imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80'
    }
  ],

  products: [
    {
      id: 'prod_luxury_carpet',
      name: 'Tailored Luxury Carpet Car Mats (4-Piece Set)',
      slug: 'tailored-luxury-carpet-car-mats-4pc',
      sku: 'CCM-LUX-4PC',
      basePrice: 44.99,
      salePrice: 38.99,
      stock: 450,
      isPublished: true,
      isFeatured: true,
      materialId: 'mat_luxury',
      defaultColor: 'Graphite Black',
      description: 'Individually CAD cut and hand-tailored to the millimetre exact dimensions of your vehicle. Handcrafted in Great Britain using our premium 850g/m² deep pile carpet with precision OEM fixing clips.',
      features: [
        'Guaranteed 100% precision fit using 3D laser-mapped scans',
        'Includes front and rear tailored mats with driver reinforced heel pad',
        'OEM factory-compatible floor anchors and twist clips included',
        'Granulated anti-slip backing prevents any footwell movement',
        'Hand-finished by British automotive upholsterers',
        'Easy to vacuum and resistant to stains & spills'
      ],
      specifications: {
        'Manufacturing Origin': 'Handmade in West Midlands, UK',
        'Carpet Density': '850 grams per square metre',
        'Edge Finish': 'Twin Sport Contrast or Hand-Piped Leatherette',
        'Backing': 'High-Tack Anti-Slip Crumb Rubber',
        'Warranty': '3-Year Manufacturer Guarantee',
        'Clips Included': 'Yes - Exact OEM System'
      },
      images: [
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1000&auto=format&fit=crop&q=80'
      ],
      compatibleMakes: ['all'],
      stitchingOptions: [
        { id: 'stitch_single', name: 'Black Classic Edge', description: 'Understated matching black overlocked finish', priceModifier: 0 },
        { id: 'stitch_gold', name: 'Signature Gold Contrast Stitch', description: 'Subtle prestige gold twin stitch detail', priceModifier: 4.99 },
        { id: 'stitch_silver', name: 'Silver / White Sport Twin Stitch', description: 'Dynamic automotive sport contrast', priceModifier: 4.99 },
        { id: 'stitch_red', name: 'Crimson Red Performance Stitch', description: 'Motorsport-inspired contrast edge', priceModifier: 4.99 },
        { id: 'stitch_blue', name: 'Royal Blue Tailored Edge', description: 'Deep blue contrast twin stitch', priceModifier: 4.99 },
        { id: 'stitch_nubuck', name: 'Prestige Nubuck Leatherette Binding', description: 'Supple padded leatherette perimeter rim', priceModifier: 8.99 }
      ],
      heelPadOptions: [
        { id: 'pad_carpet', name: 'Reinforced Carpet Heelpad', description: 'Integrated high-density wear pad for driver heel', priceModifier: 0 },
        { id: 'pad_rubber', name: 'Heavy Duty Ribbed Rubber Heelpad', description: 'Tough vulcanised rubber heel protector', priceModifier: 3.50 },
        { id: 'pad_carbon', name: 'Embossed Carbon-Look Sport Heelpad', description: 'Textured woven carbon-style wear plate', priceModifier: 6.99 }
      ],
      weightKg: 2.4,
      seoTitle: 'Tailored Luxury Carpet Car Mats | Precision Fit | Custom Car Mats UK',
      seoDescription: 'Handcrafted luxury 850g car mats made to measure for your exact car make and model. Free UK delivery over £49.',
      createdAt: '2025-01-20T12:00:00.000Z',
      updatedAt: '2025-01-20T12:00:00.000Z'
    },
    {
      id: 'prod_prestige_velour',
      name: 'Prestige Executive Velour Bespoke Car Mats',
      slug: 'prestige-executive-velour-bespoke-car-mats',
      sku: 'CCM-PRE-VELOUR',
      basePrice: 69.99,
      salePrice: 59.99,
      stock: 220,
      isPublished: true,
      isFeatured: true,
      materialId: 'mat_prestige',
      defaultColor: 'Midnight Onyx',
      description: 'The pinnacle of automotive luxury. Engineered with ultra-dense 1200g/m² spun velour yarn, giving a lavish silk-like touch that exceeds OEM specifications in high-end luxury saloons and executive GT cars.',
      features: [
        '1200g/m² heavyweight deep velour pile for supreme foot comfort',
        'Acoustically tuned sound-deadening compound underlay',
        'Includes bespoke hand-stitched nubuck edge trim as standard',
        'Precision OEM retaining anchors pre-fitted to driver & passenger mats',
        'Tailored individually per vehicle chassis order'
      ],
      specifications: {
        'Carpet Density': '1200 g/m² Ultra-Dense Velour',
        'Backing': 'Anti-Vibration Closed-Cell Neoprene Rubber',
        'Country of Origin': 'United Kingdom',
        'Edge Trim': 'Hand-Piped Leatherette / Nubuck',
        'Guarantee': '5-Year Manufacturer Warranty'
      },
      images: [
        'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000&auto=format&fit=crop&q=80'
      ],
      compatibleMakes: ['all'],
      stitchingOptions: [
        { id: 'stitch_prestige_gold', name: 'Executive Gold Twin Stitch', description: 'Hand-sewn gold twin stitch', priceModifier: 0 },
        { id: 'stitch_prestige_black', name: 'Black Leatherette Trim', description: 'Monochrome executive edge', priceModifier: 0 },
        { id: 'stitch_prestige_silver', name: 'Platinum Silver Trim', description: 'Bright executive contrast edge', priceModifier: 0 }
      ],
      heelPadOptions: [
        { id: 'pad_velour_none', name: 'Seamless Velour (OEM Style)', description: 'Clean seamless aesthetic for executive footwells', priceModifier: 0 },
        { id: 'pad_velour_carbon', name: 'Carbon-Look Sport Wear Plate', description: 'Driver heel protector with carbon weave finish', priceModifier: 6.99 }
      ],
      weightKg: 3.1,
      seoTitle: 'Prestige Executive Velour Bespoke Car Mats | 1200g/m² | Custom Car Mats UK',
      seoDescription: 'Ultra-dense 1200g velour car mats made in the UK. Better than factory OEM mats for BMW, Audi, Mercedes and more.',
      createdAt: '2025-01-22T14:00:00.000Z',
      updatedAt: '2025-01-22T14:00:00.000Z'
    },
    {
      id: 'prod_all_weather_rubber',
      name: 'All-Weather Heavy Duty Rubber Car Mats (4-Piece Set)',
      slug: 'all-weather-heavy-duty-rubber-car-mats',
      sku: 'CCM-RUB-4PC',
      basePrice: 42.99,
      salePrice: 36.99,
      stock: 580,
      isPublished: true,
      isFeatured: true,
      materialId: 'mat_rubber',
      defaultColor: 'Matte Black',
      description: 'Battle British winters with confidence. Moulded from 100% virgin odourless rubber with raised containment lips to trap rainwater, melted snow, pet dirt, and countryside mud before it reaches your vehicle carpet.',
      features: [
        '100% Waterproof natural rubber compound - zero chemical tyre smell',
        'Deep hexagonal channels trap up to 1.5 litres of liquid and grit',
        'High-pressure power washer safe - cleans in 30 seconds',
        'Direct vehicle clip fitment anchors to factory floor studs',
        'Reinforced pedal-well area resists stiletto and boot heel wear'
      ],
      specifications: {
        'Thickness': '3.2mm Solid Vulcanised Rubber',
        'Temperature Rating': '-40°C to +80°C without cracking',
        'Odour': 'Certified 100% Odourless',
        'Washability': 'Pressure-washer proof',
        'Warranty': 'Lifetime Fitment Guarantee'
      },
      images: [
        'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1000&auto=format&fit=crop&q=80'
      ],
      compatibleMakes: ['all'],
      stitchingOptions: [
        { id: 'stitch_rub_plain', name: 'Moulded Bevelled Edge', description: 'Continuous rubber spill-barrier lip', priceModifier: 0 },
        { id: 'stitch_rub_red', name: 'Red Sport Contrast Rim', description: 'Motorsport red vulcanised accent border', priceModifier: 4.99 },
        { id: 'stitch_rub_blue', name: 'Blue Sport Contrast Rim', description: 'Electric blue accent border', priceModifier: 4.99 }
      ],
      heelPadOptions: [
        { id: 'pad_rub_integrated', name: 'Integrated Diamond Ribbed Pad', description: 'Moulded non-slip driver heel reinforcement', priceModifier: 0 }
      ],
      weightKg: 4.8,
      seoTitle: 'All-Weather Heavy Duty Rubber Car Mats | 100% Waterproof UK Custom Fit',
      seoDescription: 'Tailored waterproof car mats with raised perimeter spill guard. Protects against mud, salt and rainwater.',
      createdAt: '2025-01-25T16:00:00.000Z',
      updatedAt: '2025-01-25T16:00:00.000Z'
    },
    {
      id: 'prod_diamond_quilted',
      name: 'Diamond Quilted Luxury Bespoke Mats (Complete Cabin Set)',
      slug: 'diamond-quilted-luxury-bespoke-car-mats',
      sku: 'CCM-DIA-CABIN',
      basePrice: 89.99,
      salePrice: 79.99,
      stock: 140,
      isPublished: true,
      isFeatured: true,
      materialId: 'mat_diamond',
      defaultColor: 'Caviar Black with Gold Stitch',
      description: 'Transform your vehicle interior with opulent bespoke diamond stitching. Constructed with high-resilience memory foam, waterproof PVC core, and hard-wearing composite leatherette.',
      features: [
        'Double-stitched luxury diamond quilting for supercar interior ambiance',
        '5-layer insulated structure dampens engine drone and tyre road roar',
        'Waterproof scratch-resistant surface wipes clean with a damp cloth',
        'Precision 3D high-wall contouring hugs the floor transmission tunnel',
        'Laser-cut to your specific vehicle chassis code'
      ],
      specifications: {
        'Construction': '5-Layer Composite Laminate',
        'Foam Core': '7mm High-Density Elastic Memory Foam',
        'Stitch Pattern': 'Precision 45mm Diamond Lattice',
        'Cleaning': 'Wipe clean / damp cloth maintenance',
        'Guarantee': '3-Year Premium Guarantee'
      },
      images: [
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1000&auto=format&fit=crop&q=80'
      ],
      compatibleMakes: ['all'],
      stitchingOptions: [
        { id: 'stitch_dia_gold', name: 'Gold Diamond Quilting', description: 'Bespoke gold embroidery threads', priceModifier: 0 },
        { id: 'stitch_dia_black', name: 'Stealth Black Diamond', description: 'Understated black-on-black stitching', priceModifier: 0 },
        { id: 'stitch_dia_red', name: 'Ferrari Crimson Diamond', description: 'Vibrant sport red quilting', priceModifier: 0 },
        { id: 'stitch_dia_silver', name: 'Silver Platinum Diamond', description: 'Bright luxury contrast quilting', priceModifier: 0 }
      ],
      heelPadOptions: [
        { id: 'pad_dia_metal', name: 'Brushed Aluminium Heel Plate', description: 'Aircraft-grade brushed alloy heel plate with rubber grip inserts', priceModifier: 8.99 },
        { id: 'pad_dia_rubber', name: 'Reinforced Rubber Heel Plate', description: 'Subtle textured rubber wear pad', priceModifier: 0 }
      ],
      weightKg: 3.6,
      seoTitle: 'Diamond Quilted Custom Car Mats | Tailored UK Interior Luxury',
      seoDescription: 'Transform your car footwells with custom-made diamond quilted leatherette mats. Tailored in the UK.',
      createdAt: '2025-01-28T10:00:00.000Z',
      updatedAt: '2025-01-28T10:00:00.000Z'
    },
    {
      id: 'prod_tailored_boot_liner',
      name: 'Tailored Heavy Duty Boot Liner / Trunk Mat',
      slug: 'tailored-heavy-duty-boot-liner-mat',
      sku: 'CCM-BOOT-LINER',
      basePrice: 39.99,
      salePrice: 34.99,
      stock: 310,
      isPublished: true,
      isFeatured: false,
      materialId: 'mat_rubber',
      defaultColor: 'Matte Black',
      description: 'Preserve your boot space from muddy walking boots, dogs, golf clubs, tools, and grocery spills. Laser cut to the exact contours of your luggage compartment with cut-outs for OEM cargo tie-down hooks.',
      features: [
        'Exact CAD outline matching your vehicle boot floor shape',
        'Includes fold-out bumper flap option to prevent loading scuffs',
        'Resistant to oil, pet stains, petrol, and chemical cleaners',
        'Quickly rolls up for storage when not in use'
      ],
      specifications: {
        'Material': 'Non-slip Textured Poly-Rubber',
        'Thickness': '2.8mm Flexible Tough Polymer',
        'Bumper Flap': 'Optional velcro detachable protector',
        'Warranty': '5-Year Manufacturer Warranty'
      },
      images: [
        'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000&auto=format&fit=crop&q=80'
      ],
      compatibleMakes: ['all'],
      stitchingOptions: [
        { id: 'stitch_boot_std', name: 'Black Bound Edge', description: 'Standard durable overlock', priceModifier: 0 },
        { id: 'stitch_boot_gold', name: 'Gold Contrast Edge', description: 'Matching gold perimeter trim', priceModifier: 3.99 }
      ],
      heelPadOptions: [],
      weightKg: 2.9,
      seoTitle: 'Tailored Heavy Duty Boot Liner | Laser Fit Car Trunk Mat UK',
      seoDescription: 'Custom-fit car boot liners and mats. Protect your boot floor from dogs, mud, and luggage.',
      createdAt: '2025-02-01T09:00:00.000Z',
      updatedAt: '2025-02-01T09:00:00.000Z'
    },
    {
      id: 'prod_standard_carpet',
      name: 'Classic Standard Carpet Car Mats (4-Piece Set)',
      slug: 'classic-standard-carpet-car-mats-4pc',
      sku: 'CCM-STD-4PC',
      basePrice: 29.99,
      salePrice: 24.99,
      stock: 620,
      isPublished: true,
      isFeatured: false,
      materialId: 'mat_standard',
      defaultColor: 'Anthracite Black',
      description: 'Affordable, dependable British car mats tailored specifically for your vehicle. Constructed from 650g/m² ribbed tufted carpet with reinforced driver heel pad and factory clip retention.',
      features: [
        'Tailored vehicle fit (not cheap one-size-fits-all universal mats)',
        'Reinforced driver heel pad included at no extra cost',
        'Anti-slip granular backing',
        'OEM fixing clips included to lock into floor pegs'
      ],
      specifications: {
        'Carpet Weight': '650g/m² Automotive Tufted Pile',
        'Edge Finish': 'Durable Ribbed Overlocked Cloth',
        'Origin': 'Made in the UK',
        'Warranty': '12-Month Guarantee'
      },
      images: [
        'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000&auto=format&fit=crop&q=80'
      ],
      compatibleMakes: ['all'],
      stitchingOptions: [
        { id: 'stitch_std_black', name: 'Black Overlocked Rim', description: 'Standard black edge', priceModifier: 0 },
        { id: 'stitch_std_grey', name: 'Grey Overlocked Rim', description: 'Anthracite edge', priceModifier: 2.99 }
      ],
      heelPadOptions: [
        { id: 'pad_std_carpet', name: 'Standard Carpet Heelpad', description: 'Factory carpet reinforcement', priceModifier: 0 },
        { id: 'pad_std_rubber', name: 'Moulded Rubber Heelpad', description: 'Extra durable rubber wear zone', priceModifier: 3.50 }
      ],
      weightKg: 1.9,
      seoTitle: 'Classic Standard Carpet Car Mats | Custom Fit UK Mats from £24.99',
      seoDescription: 'Tailored affordable car mats precision-cut in the UK. Complete 4-piece set with clips.',
      createdAt: '2025-02-05T11:00:00.000Z',
      updatedAt: '2025-02-05T11:00:00.000Z'
    }
  ],

  orders: [
    {
      id: 'ord_10842',
      orderNumber: 'CCM-10842',
      userId: 'usr_customer_demo',
      customerName: 'James Reynolds',
      customerEmail: 'customer@example.co.uk',
      customerPhone: '+44 7700 900123',
      shippingAddress: {
        id: 'addr_ord_1',
        isDefault: true,
        addressType: 'shipping',
        line1: '14 Parkside Gardens',
        line2: 'Clifton',
        city: 'Bristol',
        county: 'Somerset',
        postcode: 'BS8 4LJ',
        country: 'United Kingdom'
      },
      billingAddress: {
        id: 'addr_ord_1_bill',
        isDefault: true,
        addressType: 'billing',
        line1: '14 Parkside Gardens',
        line2: 'Clifton',
        city: 'Bristol',
        county: 'Somerset',
        postcode: 'BS8 4LJ',
        country: 'United Kingdom'
      },
      items: [
        {
          id: 'item_1',
          productId: 'prod_luxury_carpet',
          productName: 'Tailored Luxury Carpet Car Mats (4-Piece Set)',
          sku: 'CCM-LUX-4PC',
          quantity: 1,
          unitPrice: 38.99,
          materialName: 'Luxury Deep Pile (850g/m²)',
          colorName: 'Graphite Black',
          stitchingName: 'Signature Gold Contrast Stitch (+£4.99)',
          heelPadName: 'Reinforced Carpet Heelpad',
          vehicleDetails: {
            make: 'BMW',
            model: '3 Series',
            year: '2019 - Present (G20/G21)',
            variant: 'Saloon (4-Door)',
            regNumber: 'WP21 XKL'
          }
        }
      ],
      subtotal: 43.98,
      discountAmount: 4.40,
      shippingCost: 3.99,
      shippingMethod: 'Royal Mail 48 Tracked',
      total: 43.57,
      paymentStatus: 'paid',
      orderStatus: 'manufacturing',
      trackingNumber: 'GB184920491RM',
      courier: 'Royal Mail Tracked',
      notes: 'Customer requested quick turnaround for weekend road trip.',
      createdAt: '2025-02-14T10:15:00.000Z',
      updatedAt: '2025-02-14T14:20:00.000Z'
    },
    {
      id: 'ord_10841',
      orderNumber: 'CCM-10841',
      customerName: 'Charlotte Watson',
      customerEmail: 'c.watson@surreylaw.co.uk',
      customerPhone: '+44 7911 234567',
      shippingAddress: {
        id: 'addr_ord_2',
        isDefault: true,
        addressType: 'shipping',
        line1: 'The Old Rectory, Manor Lane',
        city: 'Guildford',
        county: 'Surrey',
        postcode: 'GU1 3QU',
        country: 'United Kingdom'
      },
      billingAddress: {
        id: 'addr_ord_2_b',
        isDefault: true,
        addressType: 'billing',
        line1: 'The Old Rectory, Manor Lane',
        city: 'Guildford',
        county: 'Surrey',
        postcode: 'GU1 3QU',
        country: 'United Kingdom'
      },
      items: [
        {
          id: 'item_2',
          productId: 'prod_prestige_velour',
          productName: 'Prestige Executive Velour Bespoke Car Mats',
          sku: 'CCM-PRE-VELOUR',
          quantity: 1,
          unitPrice: 59.99,
          materialName: 'Prestige Executive Velour (1200g/m²)',
          colorName: 'Midnight Onyx',
          stitchingName: 'Executive Gold Twin Stitch',
          heelPadName: 'Seamless Velour (OEM Style)',
          vehicleDetails: {
            make: 'Mercedes-Benz',
            model: 'C-Class',
            year: '2021 - Present (W206)',
            variant: 'Saloon (4-Door)',
            regNumber: 'GU72 ZAP'
          }
        }
      ],
      subtotal: 59.99,
      discountAmount: 0,
      shippingCost: 0,
      shippingMethod: 'DPD Next Day (Free Over £49)',
      total: 59.99,
      paymentStatus: 'paid',
      orderStatus: 'dispatched',
      trackingNumber: 'DPD1592039281',
      courier: 'DPD Express Tracked',
      createdAt: '2025-02-13T16:40:00.000Z',
      updatedAt: '2025-02-14T08:30:00.000Z'
    },
    {
      id: 'ord_10840',
      orderNumber: 'CCM-10840',
      customerName: 'Marcus Bell',
      customerEmail: 'marcus.bell@northmotors.co.uk',
      customerPhone: '+44 7822 556677',
      shippingAddress: {
        id: 'addr_ord_3',
        isDefault: true,
        addressType: 'shipping',
        line1: 'Unit 4, Didsbury Commerce Park',
        city: 'Manchester',
        county: 'Greater Manchester',
        postcode: 'M20 2EA',
        country: 'United Kingdom'
      },
      billingAddress: {
        id: 'addr_ord_3_b',
        isDefault: true,
        addressType: 'billing',
        line1: 'Unit 4, Didsbury Commerce Park',
        city: 'Manchester',
        county: 'Greater Manchester',
        postcode: 'M20 2EA',
        country: 'United Kingdom'
      },
      items: [
        {
          id: 'item_3',
          productId: 'prod_all_weather_rubber',
          productName: 'All-Weather Heavy Duty Rubber Car Mats (4-Piece Set)',
          sku: 'CCM-RUB-4PC',
          quantity: 2,
          unitPrice: 36.99,
          materialName: 'Heavy Duty 3mm All-Weather Rubber',
          colorName: 'Matte Black',
          stitchingName: 'Moulded Bevelled Edge',
          heelPadName: 'Integrated Diamond Ribbed Pad',
          vehicleDetails: {
            make: 'Land Rover',
            model: 'Range Rover Sport',
            year: '2022 - Present (L461)',
            variant: 'Standard / Dynamic'
          }
        }
      ],
      subtotal: 73.98,
      discountAmount: 5.00,
      shippingCost: 0,
      shippingMethod: 'DPD Express UK',
      total: 68.98,
      paymentStatus: 'paid',
      orderStatus: 'delivered',
      trackingNumber: 'DPD8492019482',
      courier: 'DPD Express Tracked',
      createdAt: '2025-02-10T11:20:00.000Z',
      updatedAt: '2025-02-12T15:10:00.000Z'
    }
  ],

  reviews: [
    {
      id: 'rev_1',
      productId: 'prod_luxury_carpet',
      productName: 'Tailored Luxury Carpet Car Mats',
      authorName: 'David H.',
      authorLocation: 'Harrogate, North Yorkshire',
      carMakeModel: 'BMW 3 Series G20 (2021)',
      rating: 5,
      title: 'Fits better than original BMW showroom mats!',
      comment: 'I was sceptical about buying online, but these mats arrived within 3 working days via DPD. The OEM twist clips snapped into the floor pegs with zero hassle. The gold contrast stitching matches my cognac leather interior perfectly. Highly recommended.',
      status: 'approved',
      isFeatured: true,
      verifiedBuyer: true,
      createdAt: '2025-02-11T13:45:00.000Z'
    },
    {
      id: 'rev_2',
      productId: 'prod_prestige_velour',
      productName: 'Prestige Executive Velour Bespoke Car Mats',
      authorName: 'Eleanor Vance',
      authorLocation: 'Kensington, London',
      carMakeModel: 'Mercedes-Benz E-Class W213',
      rating: 5,
      title: 'Supreme British craftsmanship. Outstanding thickness.',
      comment: 'The 1200g velour is like stepping onto a luxury hotel carpet. Sound dampening on motorway runs is noticeably better. Great telephone customer support when I queried my clip type too.',
      status: 'approved',
      isFeatured: true,
      verifiedBuyer: true,
      createdAt: '2025-02-08T09:12:00.000Z'
    },
    {
      id: 'rev_3',
      productId: 'prod_all_weather_rubber',
      productName: 'All-Weather Heavy Duty Rubber Car Mats',
      authorName: 'Calum MacLeod',
      authorLocation: 'Inverness, Scottish Highlands',
      carMakeModel: 'Land Rover Discovery / Defender',
      rating: 5,
      title: 'Zero rubber smell, completely impervious to Highland mud',
      comment: 'Cheap supermarket mats always smell like noxious petroleum, but these have no odour whatsoever. Deep channels hold all the slush and snow from hiking boots. A quick spray with the Kärcher pressure washer and they are like brand new.',
      status: 'approved',
      isFeatured: true,
      verifiedBuyer: true,
      createdAt: '2025-02-04T17:20:00.000Z'
    },
    {
      id: 'rev_4',
      productId: 'prod_diamond_quilted',
      productName: 'Diamond Quilted Luxury Bespoke Mats',
      authorName: 'Tariq A.',
      authorLocation: 'Solihull, West Midlands',
      carMakeModel: 'Audi A6 Black Edition (2022)',
      rating: 5,
      title: 'Gives the car an instant £10k luxury interior upgrade',
      comment: 'Everyone who gets in compliments the diamond pattern. Easy to wipe clean with leather wipes. The aluminium heel plate looks fantastic and feels ultra sturdy.',
      status: 'approved',
      isFeatured: true,
      verifiedBuyer: true,
      createdAt: '2025-01-30T14:10:00.000Z'
    },
    {
      id: 'rev_5',
      productId: 'prod_luxury_carpet',
      productName: 'Tailored Luxury Carpet Car Mats',
      authorName: 'Liam O’Connor',
      authorLocation: 'Belfast, Northern Ireland',
      carMakeModel: 'Volkswagen Golf Mk8',
      rating: 4,
      title: 'Great quality, prompt delivery over the Irish Sea',
      comment: 'Arrived nicely boxed without being crushed or folded. The clips matched the factory pins perfectly. Driver heel pad is positioned in the exact right spot.',
      status: 'approved',
      isFeatured: false,
      verifiedBuyer: true,
      createdAt: '2025-01-26T11:00:00.000Z'
    },
    {
      id: 'rev_6',
      productId: 'prod_all_weather_rubber',
      productName: 'All-Weather Heavy Duty Rubber Car Mats',
      authorName: 'George Parker',
      authorLocation: 'Bath, Somerset',
      carMakeModel: 'Ford Puma ST-Line',
      rating: 5,
      title: 'Awaiting moderation test review',
      comment: 'Ordered yesterday and wanted to leave preliminary feedback on how intuitive the car selector was.',
      status: 'pending',
      isFeatured: false,
      verifiedBuyer: true,
      createdAt: '2025-02-14T11:30:00.000Z'
    }
  ],

  blogPosts: [
    {
      id: 'blog_1',
      title: 'Carpet vs Rubber Car Mats: Which is Right for British Weather?',
      slug: 'carpet-vs-rubber-car-mats-british-weather-guide',
      category: 'Buying Guides',
      excerpt: 'Compare deep-pile luxury automotive carpet against 100% waterproof vulcanised rubber to discover which material best protects your vehicle floor pan throughout the seasons.',
      content: `## Choosing the Ideal Protection for Your Vehicle Footwell

The British climate presents unique challenges for motor vehicle interiors. Between autumn rain, winter road gritting salt, and spring mud, your vehicle’s factory carpet is under constant threat of dampness, mildew, and permanent fibre wear.

### The Case for Tailored Luxury Carpet Mats
For motorists who spend substantial time in their vehicles commuting or touring, our 850g/m² and 1200g/m² tufted carpets offer comfort that rubber cannot rival:
- **Acoustic Absorption:** High-density carpet pile absorbs road vibration and tyre drone through the floorpan.
- **Prestige Appearance:** Complements luxury leather and alcantara upholstery.
- **Reinforced Heelpad:** Ensures the area under the accelerator and clutch pedals does not wear through prematurely.

### The Case for All-Weather Heavy Duty Rubber
If your routine involves country dog walks, construction sites, outdoor sports, or wet school runs, heavy-duty vulcanised rubber is unbeatable:
- **100% Fluid Containment:** Raised spill edges trap up to 1.5 litres of liquid.
- **30-Second Maintenance:** Can be pressure-washed or jet-sprayed at any filling station.
- **Odourless Virgin Rubber:** No noxious petrol smells inside your cabin when the heater is on.

### The Enthusiast's Compromise: Seasonal Swapping
Many UK motorists keep a tailored set of rubber mats for the damp months between October and March, transitioning to plush deep-pile velour for the summer driving season.`,
      author: 'Edward Sterling, Master Trimmer',
      readTime: '4 min read',
      imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000&auto=format&fit=crop&q=80',
      isPublished: true,
      publishedAt: '2025-01-15T10:00:00.000Z',
      tags: ['Car Care', 'Winter Driving', 'Carpet Mats', 'Rubber Mats'],
      seoTitle: 'Carpet vs Rubber Car Mats Guide | Custom Car Mats UK',
      seoDescription: 'Find out whether tailored carpet or all-weather rubber mats suit your vehicle and driving habits best. Expert advice from UK automotive trimmers.',
      createdAt: '2025-01-15T10:00:00.000Z'
    },
    {
      id: 'blog_2',
      title: 'How 3D Laser Scanning Guarantees a Millimetre-Perfect Car Mat Fit',
      slug: 'how-3d-laser-scanning-guarantees-perfect-car-mat-fit',
      category: 'Manufacturing',
      excerpt: 'Go behind the scenes at our West Midlands facility to see how high-precision optical laser scanners map every curve, clutch clearance, and OEM anchor peg.',
      content: `## The Science of Millimetre-Accurate Tailoring

Universal "trim-to-fit" car mats sold in supermarkets are not only unsightly—they can be downright dangerous if an ill-fitting driver's mat slips under the brake or clutch pedals.

At Custom Car Mats, every single pattern in our 4,000+ vehicle database is generated via direct physical 3D optical laser scanning of UK right-hand-drive (RHD) vehicles.

### Step 1: Laser Point-Cloud Mapping
Using industrial handheld LiDAR scanners, our automotive technicians digitise the entire footwell basin down to a tolerance of 0.2mm. We capture:
- Floor pan undulations and transmission tunnel curvature
- Clutch, brake, and throttle pedal travel clearance paths
- Exact coordinate locations of factory OEM twist studs and push pins

### Step 2: CNC Oscillating Blade Cutting
Once mapped, raw carpet rolls and rubber sheets are vacuum-clamped to automated CNC cutting tables. High-frequency oscillating blades cut the mat contours cleanly without fraying the edging.

### Step 3: Master Hand-Stitching and Edging
Every set is passed to our team of skilled British trimmers. Edges are bound with high-tensile UV-stabilised thread in your choice of contrast colour, single stitch, or nubuck leatherette piping.`,
      author: 'Sophie Cartwright',
      readTime: '3 min read',
      imageUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1000&auto=format&fit=crop&q=80',
      isPublished: true,
      publishedAt: '2025-01-28T14:30:00.000Z',
      tags: ['Manufacturing', 'Laser Scanning', 'British Craftsmanship'],
      seoTitle: 'How 3D Laser Scanning Ensures Precision Car Mat Fit | Custom Car Mats',
      seoDescription: 'Discover how we use 3D laser mapping to craft precision-tailored car mats for over 4,000 UK vehicle models.',
      createdAt: '2025-01-28T14:30:00.000Z'
    },
    {
      id: 'blog_3',
      title: 'Understanding Car Mat Fixing Clips: BMW, Audi, Mercedes & VW Systems',
      slug: 'understanding-car-mat-fixing-clips-oem-guide',
      category: 'Technical Advice',
      excerpt: 'A comprehensive visual guide to factory floor fixing mechanisms. Learn how our pre-installed OEM clips lock your custom mats securely in place.',
      content: `## Why Mat Retention is Critical for Road Safety

Under UK MOT guidelines and road safety regulations, any driver's floor mat that interferes with pedal operation or slides uncontrollably is considered a safety hazard. That is why we provide factory-compatible retaining clips with every tailored car mat set we manufacture.

### 1. BMW & MINI: Floor Peg Twist Clamps
Modern BMW models (F30, G20, F40) utilise round plastic floor posts with a 90-degree twist-locking pin. We supply pre-punched reinforced eyelets with matching OEM twist caps that lock with a quarter-turn.

### 2. Volkswagen & Audi: Push-Button Studs
VAG group vehicles commonly feature two circular raised push pins in the front footwells. Our mats come with genuine-specification snap-lock caps that produce a positive 'click' when pressed into place.

### 3. Mercedes-Benz: Oval Eyelet Twist Locks
Mercedes-Benz vehicles often utilise elongated oval floor studs. Our precision oval grommets align without stretching the carpet pile.

### Have an Older or Classic Car Without Floor Pegs?
We also supply universal screw-in floor anchors that gently thread into the vehicle under-carpet without damaging structural metalwork.`,
      author: 'Oliver Hughes',
      readTime: '5 min read',
      imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1000&auto=format&fit=crop&q=80',
      isPublished: true,
      publishedAt: '2025-02-05T09:00:00.000Z',
      tags: ['OEM Clips', 'Safety', 'BMW', 'Audi', 'Mercedes'],
      seoTitle: 'Car Mat Fixing Clips Explained: OEM Systems Guide | Custom Car Mats',
      seoDescription: 'Learn how BMW twist clips, Audi push-button studs and Mercedes eyelets work with our custom-fit car mats.',
      createdAt: '2025-02-05T09:00:00.000Z'
    }
  ],

  coupons: [
    {
      id: 'coup_welcome',
      code: 'WELCOME10',
      discountType: 'percentage',
      discountValue: 10,
      minSpend: 30,
      usageLimit: 1000,
      usedCount: 84,
      isActive: true,
      expiresAt: '2026-12-31T23:59:59.000Z'
    },
    {
      id: 'coup_ukdrive',
      code: 'UKDRIVE',
      discountType: 'fixed',
      discountValue: 5,
      minSpend: 40,
      usageLimit: 500,
      usedCount: 42,
      isActive: true,
      expiresAt: '2026-12-31T23:59:59.000Z'
    },
    {
      id: 'coup_freeship',
      code: 'FREESHIP',
      discountType: 'fixed',
      discountValue: 3.99,
      minSpend: 35,
      usageLimit: 500,
      usedCount: 29,
      isActive: true,
      expiresAt: '2026-12-31T23:59:59.000Z'
    }
  ],

  contactMessages: [
    {
      id: 'msg_1',
      name: 'Trevor Jenkins',
      email: 'trevor.j@sky.com',
      phone: '+44 7900 112233',
      vehicleReg: 'BK22 YTP',
      subject: 'Custom embroidery enquiry for classic Jaguar',
      message: 'Hello, I have a 1998 Jaguar XJ8 Sovereign and would like to know if you can embroider the Jaguar leaper badge onto front Prestige Velour mats in gold thread? Thank you.',
      status: 'unread',
      createdAt: '2025-02-14T08:45:00.000Z'
    },
    {
      id: 'msg_2',
      name: 'Sarah Lindley',
      email: 'sarah.lindley@btinternet.com',
      phone: '+44 7811 445566',
      vehicleReg: 'LP70 FXD',
      subject: 'Delivery timeframe to Scottish Highlands',
      message: 'Hi there, do you ship to the Isle of Skye via Royal Mail or DPD, and does standard shipping take longer than the quoted 3-5 working days?',
      status: 'read',
      createdAt: '2025-02-13T14:10:00.000Z'
    }
  ],

  newsletterSubscribers: [
    { id: 'sub_1', email: 'driver99@gmail.com', status: 'active', subscribedAt: '2025-01-18T10:00:00.000Z' },
    { id: 'sub_2', email: 'bmw_enthusiast_uk@outlook.com', status: 'active', subscribedAt: '2025-01-22T14:30:00.000Z' },
    { id: 'sub_3', email: 'claire.morris@yahoo.co.uk', status: 'active', subscribedAt: '2025-02-02T09:15:00.000Z' }
  ],

  pages: [
    {
      id: 'page_about',
      slug: 'about-us',
      title: 'About Custom Car Mats | British Automotive Heritage',
      content: `## Handcrafted Excellence for Great British Motorists

Founded in the heart of the West Midlands—the historic automotive manufacturing capital of the United Kingdom—**Custom Car Mats** was born from a straightforward belief: every car owner deserves floor protection that matches the precision engineering of their vehicle.

### Precision CAD Tailoring
We do not believe in generic one-size-fits-all products. Using modern 3D laser digitisation, our design team maps the exact floor contours of over 4,000 UK vehicle models. When you order from Custom Car Mats, your mats are laser cut and hand-tailored to the millimetre.

### British Craftsmanship & Materials
From heavy-duty all-weather vulcanised rubber to our opulent 1200g/m² prestige velour, our raw materials are sourced from accredited UK suppliers. Every mat is hand-finished with precision edge piping, high-tensile twin stitching, and authentic OEM fixing clips.

### Our 100% Fitment Guarantee
We stand behind every set leaving our workshop with an ironclad 100% Fitment Guarantee and up to 5 years manufacturer warranty. If your mats do not fit your specified vehicle with factory precision, we will re-tailor or refund them with zero fuss.`,
      isPublished: true,
      lastEditedBy: 'Edward Sterling',
      updatedAt: '2025-01-20T10:00:00.000Z',
      seoTitle: 'About Us | Custom Car Mats UK Automotive Specialists',
      seoDescription: 'Learn about Custom Car Mats, handcrafted British automotive floor protection with 3D laser precision fitment.'
    },
    {
      id: 'page_shipping',
      slug: 'shipping-delivery',
      title: 'UK Delivery & Shipping Information',
      content: `## Fast, Reliable Delivery Across Great Britain & Northern Ireland

Because each set of car mats is custom-tailored to your exact vehicle make, model, year, and colour specification, our standard production cycle is 1 to 2 working days.

### UK Shipping Options & Rates
- **Standard Royal Mail 48 Tracked:** £3.99 (Delivered in 2-3 working days following manufacture). **FREE on all orders over £49.00!**
- **Express DPD Next Day Tracked:** £6.99 (Dispatched via DPD with 1-hour delivery time slot and SMS notifications).
- **Highlands, Islands & Northern Ireland:** We deliver to all UK postcodes including Isle of Man, Scottish Highlands, and Northern Ireland with zero surcharge on Royal Mail 48 Tracked.

### Real-Time Tracking
As soon as your mats leave our final quality inspection bay, you will receive an automated dispatch notification with your trackable courier tracking number.`,
      isPublished: true,
      lastEditedBy: 'Sophie Cartwright',
      updatedAt: '2025-01-22T11:00:00.000Z',
      seoTitle: 'UK Shipping & Delivery | Custom Car Mats',
      seoDescription: 'Fast UK delivery on tailored car mats. Free delivery over £49 with DPD and Royal Mail Tracked.'
    },
    {
      id: 'page_returns',
      slug: 'returns-guarantee',
      title: 'Returns Policy & 100% Fitment Guarantee',
      content: `## Our Promise: Perfect Fit or Your Money Back

We take immense pride in our craftsmanship. If for any reason your mats do not fit your specified vehicle or arrive with any manufacturing defect, our UK customer care team is here to assist.

### 30-Day Hassle-Free Returns
- **Fitment Issues:** Contact our support team with a photo of your footwell and vehicle registration. We will verify the CAD template and immediately dispatch a corrected replacement.
- **Manufacturing Defects:** All carpet seams, binding, and heelpads are covered by a minimum 2-Year Manufacturer Guarantee (up to 5 years on Prestige Velour).
- **Return Conditions:** Items must be in clean, unsoiled condition. Please contact support@customcarmats.co.uk to obtain a tracked return label.`,
      isPublished: true,
      lastEditedBy: 'Sophie Cartwright',
      updatedAt: '2025-01-24T15:00:00.000Z',
      seoTitle: 'Returns & 100% Fitment Guarantee | Custom Car Mats UK',
      seoDescription: 'Read about our 30-day returns and 100% precision fitment guarantee.'
    },
    {
      id: 'page_privacy',
      slug: 'privacy-policy',
      title: 'Privacy Policy',
      content: `## Privacy Notice & GDPR Compliance

Custom Car Mats ("we", "our") is dedicated to safeguarding your personal data in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.

### Data We Collect
- Contact details (name, email address, telephone number)
- Delivery and billing address
- Vehicle registration number and vehicle specification (used solely to ensure tailored mat accuracy)
- Payment transaction identifiers (processed securely via Stripe; we never store your full payment card details)

### How We Use Your Information
Your data is used strictly to manufacture, dispatch, and support your order, as well as to communicate service updates. We do not sell or rent customer data to any third-party marketing companies.`,
      isPublished: true,
      lastEditedBy: 'Edward Sterling',
      updatedAt: '2025-01-10T12:00:00.000Z',
      seoTitle: 'Privacy Policy | Custom Car Mats UK',
      seoDescription: 'Our UK GDPR-compliant privacy notice and data handling policy.'
    },
    {
      id: 'page_terms',
      slug: 'terms-conditions',
      title: 'Terms & Conditions of Sale',
      content: `## Terms & Conditions

Welcome to Custom Car Mats. By placing an order via our online portal, you agree to the following terms and conditions governed under the laws of England and Wales.

### 1. Order Customisation
All mats are manufactured to individual vehicle specifications selected at checkout. It is the customer's responsibility to verify their vehicle make, model, year, and body variant before placing an order.

### 2. Pricing and Payment
All prices are displayed in Pounds Sterling (£ GBP) and are inclusive of standard UK VAT at 20%. Payments are securely processed via Stripe.

### 3. Intellectual Property
All product imagery, CAD designs, graphics, and text on this website are the intellectual property of Custom Car Mats UK Ltd.`,
      isPublished: true,
      lastEditedBy: 'Edward Sterling',
      updatedAt: '2025-01-10T12:00:00.000Z',
      seoTitle: 'Terms & Conditions of Sale | Custom Car Mats UK',
      seoDescription: 'Terms and conditions for purchasing tailored car mats from Custom Car Mats.'
    }
  ],

  auditLogs: [
    {
      id: 'log_1',
      adminId: 'usr_superadmin',
      adminName: 'Edward Sterling',
      adminEmail: 'admin@customcarmats.co.uk',
      action: 'SYSTEM_INIT',
      entityType: 'System',
      details: 'Initialised Custom Car Mats production database and seeded core UK vehicles',
      createdAt: '2025-01-10T09:00:00.000Z'
    },
    {
      id: 'log_2',
      adminId: 'usr_superadmin',
      adminName: 'Edward Sterling',
      adminEmail: 'admin@customcarmats.co.uk',
      action: 'UPDATE_PRODUCT',
      entityType: 'Product',
      entityId: 'prod_luxury_carpet',
      details: 'Updated promotional sale price to £38.99 for winter campaign',
      createdAt: '2025-01-20T12:30:00.000Z'
    },
    {
      id: 'log_3',
      adminId: 'usr_order_mgr',
      adminName: 'Oliver Hughes',
      adminEmail: 'orders@customcarmats.co.uk',
      action: 'UPDATE_ORDER_STATUS',
      entityType: 'Order',
      entityId: 'ord_10842',
      details: 'Changed status from Confirmed to Manufacturing and assigned cutting bay 3',
      createdAt: '2025-02-14T14:20:00.000Z'
    }
  ],

  settings: {
    storeName: 'Custom Car Mats',
    supportEmail: 'support@customcarmats.co.uk',
    supportPhone: '0800 488 0244',
    registeredAddress: 'Unit 7, Apex Automotive Centre, Coventry, West Midlands, CV3 4GB, United Kingdom',
    companyNumber: '11928472',
    vatNumber: 'GB 342 9812 04',
    currencySymbol: '£',
    currencyCode: 'GBP',
    vatRatePercentage: 20,
    freeShippingThreshold: 49.00,
    standardShippingFee: 3.99,
    expressShippingFee: 6.99,
    stripeConfigured: true,
    metaTitle: 'Custom Car Mats - UK Premium Tailored Car Mats',
    metaDescription: 'Precision-fit custom car mats engineered for your vehicle. Handcrafted luxury carpet, all-weather rubber, and tailored prestige car floor mats with fast UK delivery.'
  }
};
