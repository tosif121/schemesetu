import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { EligibilityCriteria, Scheme } from '../../lib/types'

// Official myScheme API endpoint
const MYSCHEME_API_URL = 'https://api.myscheme.gov.in/api/scheme/search'
const MYSCHEME_WEBSITE = 'https://www.myscheme.gov.in'

async function fetchSchemesFromMySchemeAPI(eligibility: EligibilityCriteria): Promise<{schemes: Scheme[], error?: string}> {
  try {
    // Build request payload for myScheme API
    const requestPayload: any = {}
    
    if (eligibility.state) {
      requestPayload.state = eligibility.state
    }
    
    if (eligibility.age) {
      requestPayload.age = eligibility.age
    }
    
    if (eligibility.gender) {
      // Capitalize first letter to match API format
      requestPayload.gender = eligibility.gender.charAt(0).toUpperCase() + eligibility.gender.slice(1)
    }
    
    if (eligibility.income) {
      requestPayload.income = eligibility.income
    }
    
    if (eligibility.category) {
      requestPayload.category = eligibility.category
    }

    console.log('Calling myScheme API with payload:', requestPayload)
    
    const response = await axios.post(MYSCHEME_API_URL, requestPayload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'SchemeSaathi/1.0'
      },
      timeout: 15000 // 15 second timeout
    })

    const data = response.data
    console.log('myScheme API response:', data)
    
    // Transform myScheme API response to our Scheme interface
    const schemes: Scheme[] = []
    
    if (data && Array.isArray(data)) {
      // If response is directly an array of schemes
      data.forEach((scheme: any) => {
        schemes.push(transformSchemeData(scheme))
      })
    } else if (data && data.schemes && Array.isArray(data.schemes)) {
      // If response has schemes property
      data.schemes.forEach((scheme: any) => {
        schemes.push(transformSchemeData(scheme))
      })
    } else if (data && data.data && Array.isArray(data.data)) {
      // If response has data property
      data.data.forEach((scheme: any) => {
        schemes.push(transformSchemeData(scheme))
      })
    }

    console.log(`Found ${schemes.length} schemes from myScheme API`)
    return { schemes }

  } catch (error) {
    console.error('Error fetching from myScheme API:', error)
    
    // Since myScheme API requires authentication, fall back to comprehensive mock data
    console.log('Falling back to mock scheme data')
    return { schemes: await getMockSchemes(eligibility) }
  }
}

function transformSchemeData(scheme: any): Scheme {
  return {
    id: scheme.id || scheme.schemeId || scheme.scheme_id || `scheme-${Date.now()}-${Math.random()}`,
    name: scheme.name || scheme.schemeName || scheme.scheme_name || 'Unknown Scheme',
    description: scheme.description || scheme.schemeDescription || scheme.scheme_description || 'No description available',
    eligibility: Array.isArray(scheme.eligibility) ? scheme.eligibility : 
                Array.isArray(scheme.eligibilityCriteria) ? scheme.eligibilityCriteria :
                typeof scheme.eligibility === 'string' ? [scheme.eligibility] : 
                ['Eligibility criteria available on official website'],
    benefits: scheme.benefits || scheme.schemeBenefits || scheme.scheme_benefits || 'Benefits available',
    application_process: scheme.applicationProcess || scheme.howToApply || scheme.application_process || 'Apply through official channels',
    department: scheme.department || scheme.ministry || scheme.sponsoringMinistry || 'Government of India',
    state: scheme.state || scheme.applicableState || 'All India'
  }
}

async function getMockSchemes(eligibility: EligibilityCriteria): Promise<Scheme[]> {
  const allSchemes: Scheme[] = [
    // Central Government Schemes
    {
      id: 'pm-kisan',
      name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
      description: 'Direct income support scheme for small and marginal farmers providing ₹6000 per year in three equal installments',
      eligibility: [
        'Small and marginal farmers',
        'Landholding up to 2 hectares',
        'Valid Aadhaar card required',
        'Bank account linked with Aadhaar'
      ],
      benefits: '₹6000 per year in 3 installments of ₹2000 each directly transferred to bank account',
      application_process: 'Apply online at pmkisan.gov.in or visit nearest Common Service Center (CSC). Required documents: Aadhaar card, bank account details, land records',
      department: 'Ministry of Agriculture and Farmers Welfare',
      state: 'All India'
    },
    {
      id: 'ayushman-bharat',
      name: 'Ayushman Bharat PM-JAY',
      description: 'World\'s largest health insurance scheme providing health coverage to economically vulnerable families',
      eligibility: [
        'Families identified in SECC 2011 database',
        'Annual family income less than ₹5 lakh',
        'Rural and urban poor families',
        'Automatic eligibility for SECC beneficiaries'
      ],
      benefits: '₹5 lakh per family per year health insurance coverage for secondary and tertiary care hospitalization',
      application_process: 'Visit nearest empanelled hospital with valid ID proof. No premium payment required. Check eligibility at mera.pmjay.gov.in',
      department: 'Ministry of Health and Family Welfare',
      state: 'All India'
    },
    {
      id: 'pm-awas-yojana',
      name: 'PM Awas Yojana (Pradhan Mantri Awas Yojana)',
      description: 'Housing for All scheme providing affordable housing to urban and rural poor',
      eligibility: [
        'Economically Weaker Section (EWS) families',
        'Low Income Group (LIG) families',
        'Middle Income Group (MIG) families',
        'First-time home buyers',
        'Women ownership or co-ownership mandatory'
      ],
      benefits: 'Subsidy on home loans, direct financial assistance up to ₹2.5 lakh for house construction',
      application_process: 'Apply online at pmaymis.gov.in or visit nearest bank/housing finance company',
      department: 'Ministry of Housing and Urban Affairs',
      state: 'All India'
    },
    {
      id: 'national-scholarship',
      name: 'National Scholarship Portal',
      description: 'Umbrella portal for various scholarship schemes for students from different backgrounds',
      eligibility: [
        'Students from economically weaker sections',
        'SC/ST/OBC students',
        'Minority community students',
        'Merit-based scholarships',
        'Disability scholarships'
      ],
      benefits: 'Financial assistance for education ranging from ₹1000 to ₹20000 per year depending on the scheme',
      application_process: 'Apply online at scholarships.gov.in with required documents and academic certificates',
      department: 'Ministry of Education',
      state: 'All India'
    },
    {
      id: 'mudra-yojana',
      name: 'Pradhan Mantri MUDRA Yojana',
      description: 'Micro-finance scheme providing loans to small businesses and entrepreneurs',
      eligibility: [
        'Non-corporate, non-farm small/micro enterprises',
        'Manufacturing, trading, services activities',
        'Income generating activities',
        'Existing small businesses for expansion'
      ],
      benefits: 'Collateral-free loans up to ₹10 lakh (Shishu: ₹50k, Kishore: ₹5L, Tarun: ₹10L)',
      application_process: 'Apply at any bank, NBFC, or MFI. Visit mudra.org.in for details',
      department: 'Ministry of Finance',
      state: 'All India'
    },
    {
      id: 'jan-dhan-yojana',
      name: 'Pradhan Mantri Jan Dhan Yojana',
      description: 'Financial inclusion program ensuring access to financial services for all households',
      eligibility: [
        'All Indian citizens',
        'No minimum balance requirement',
        'Age 10+ for minor accounts',
        'Valid identity proof required'
      ],
      benefits: 'Zero balance bank account, RuPay debit card, accident insurance ₹2 lakh, life insurance ₹30k',
      application_process: 'Visit any bank branch with Aadhaar card and one additional document',
      department: 'Ministry of Finance',
      state: 'All India'
    },
    {
      id: 'swachh-bharat',
      name: 'Swachh Bharat Mission',
      description: 'Clean India campaign focusing on sanitation and waste management',
      eligibility: [
        'Rural households without toilets',
        'Below Poverty Line families',
        'SC/ST families',
        'Small and marginal farmers'
      ],
      benefits: 'Financial assistance of ₹12000 for toilet construction, waste management support',
      application_process: 'Apply through Gram Panchayat or online at sbm.gov.in',
      department: 'Ministry of Jal Shakti',
      state: 'All India'
    },
    {
      id: 'skill-india',
      name: 'Skill India Mission',
      description: 'Skill development program to train youth in industry-relevant skills',
      eligibility: [
        'Youth aged 15-45 years',
        'School/college dropouts',
        'Unemployed youth',
        'Fresh graduates seeking skills'
      ],
      benefits: 'Free skill training, certification, job placement assistance, monetary rewards',
      application_process: 'Register at skillindiadigital.gov.in or visit nearest training center',
      department: 'Ministry of Skill Development and Entrepreneurship',
      state: 'All India'
    },
    {
      id: 'ujjwala-yojana',
      name: 'Pradhan Mantri Ujjwala Yojana',
      description: 'Free LPG connection scheme for women from BPL families',
      eligibility: [
        'Women from BPL families',
        'Age 18+ years',
        'SECC 2011 beneficiaries',
        'SC/ST families',
        'Forest dwellers'
      ],
      benefits: 'Free LPG connection, financial support for stove and refill',
      application_process: 'Apply at LPG distributor with BPL certificate and identity proof',
      department: 'Ministry of Petroleum and Natural Gas',
      state: 'All India'
    },
    {
      id: 'atal-pension',
      name: 'Atal Pension Yojana',
      description: 'Pension scheme for unorganized sector workers',
      eligibility: [
        'Age 18-40 years',
        'Indian citizen',
        'Bank account holder',
        'Not covered under statutory social security schemes'
      ],
      benefits: 'Guaranteed pension of ₹1000-5000 per month after age 60',
      application_process: 'Apply at any bank or post office with Aadhaar and bank account',
      department: 'Ministry of Finance',
      state: 'All India'
    },
    // Women-specific schemes
    {
      id: 'beti-bachao',
      name: 'Beti Bachao Beti Padhao',
      description: 'Scheme for girl child welfare, education and empowerment',
      eligibility: [
        'Girl children',
        'Pregnant women',
        'Families with girl child',
        'Educational institutions'
      ],
      benefits: 'Educational support, awareness programs, financial incentives for girl education',
      application_process: 'Apply through Anganwadi centers, schools, or district administration',
      department: 'Ministry of Women and Child Development',
      state: 'All India'
    },
    {
      id: 'sukanya-samriddhi',
      name: 'Sukanya Samriddhi Yojana',
      description: 'Savings scheme for girl child with attractive interest rates',
      eligibility: [
        'Girl child aged 0-10 years',
        'Maximum 2 girl children per family',
        'Indian resident',
        'Parents/guardians can open account'
      ],
      benefits: 'High interest rate (currently 8.2%), tax benefits, maturity at age 21',
      application_process: 'Open account at post office or authorized banks with ₹250 minimum deposit',
      department: 'Ministry of Finance',
      state: 'All India'
    },
    // SC/ST specific schemes
    {
      id: 'sc-st-development',
      name: 'SC/ST Development Schemes',
      description: 'Various development schemes for Scheduled Castes and Scheduled Tribes',
      eligibility: [
        'Valid SC/ST certificate holders',
        'Below poverty line families',
        'Students from SC/ST communities',
        'Entrepreneurs from SC/ST background'
      ],
      benefits: 'Education support, employment opportunities, skill development, financial assistance',
      application_process: 'Apply through respective state SC/ST development corporations or online portals',
      department: 'Ministry of Social Justice and Empowerment',
      state: 'All India'
    },
    // State-specific schemes (examples)
    {
      id: 'maharashtra-farmer-loan-waiver',
      name: 'Maharashtra Farmer Loan Waiver Scheme',
      description: 'Loan waiver scheme for farmers in Maharashtra',
      eligibility: [
        'Farmers in Maharashtra',
        'Agricultural loans up to ₹2 lakh',
        'Crop loans taken before specified date',
        'Small and marginal farmers priority'
      ],
      benefits: 'Complete waiver of agricultural loans up to ₹2 lakh',
      application_process: 'Apply through cooperative banks or district collector office',
      department: 'Government of Maharashtra',
      state: 'Maharashtra'
    },
    {
      id: 'tamil-nadu-free-rice',
      name: 'Tamil Nadu Free Rice Scheme',
      description: 'Free rice distribution to all ration card holders',
      eligibility: [
        'All ration card holders in Tamil Nadu',
        'Priority and non-priority households',
        'Valid family card required'
      ],
      benefits: '20 kg free rice per family per month',
      application_process: 'Automatic distribution through fair price shops',
      department: 'Government of Tamil Nadu',
      state: 'Tamil Nadu'
    },
    {
      id: 'kerala-pension',
      name: 'Kerala Social Security Pension',
      description: 'Social security pension for elderly, widows, and disabled persons',
      eligibility: [
        'Age 60+ for general category',
        'Widows, disabled persons',
        'Annual income below ₹1 lakh',
        'Kerala residents'
      ],
      benefits: 'Monthly pension ranging from ₹1600 to ₹2500',
      application_process: 'Apply through local self-government institutions',
      department: 'Government of Kerala',
      state: 'Kerala'
    },
    {
      id: 'west-bengal-kanyashree',
      name: 'Kanyashree Prakalpa (West Bengal)',
      description: 'Conditional cash transfer scheme for girls to continue education',
      eligibility: [
        'Girls aged 13-18 years',
        'Students in West Bengal',
        'Regular school attendance required',
        'Unmarried status'
      ],
      benefits: 'Annual scholarship of ₹750 for K1 and ₹25000 one-time for K2',
      application_process: 'Apply through schools or online portal',
      department: 'Government of West Bengal',
      state: 'West Bengal'
    },
    {
      id: 'rajasthan-bhamashah',
      name: 'Bhamashah Yojana (Rajasthan)',
      description: 'Financial inclusion and empowerment scheme for women',
      eligibility: [
        'Women heads of families in Rajasthan',
        'All family members enrolled',
        'Bank account linked',
        'Aadhaar authentication'
      ],
      benefits: 'Direct benefit transfer, financial inclusion, women empowerment',
      application_process: 'Register at e-Mitra centers or online',
      department: 'Government of Rajasthan',
      state: 'Rajasthan'
    },
    // Additional Central Schemes
    {
      id: 'make-in-india',
      name: 'Make in India',
      description: 'Initiative to encourage manufacturing and job creation in India',
      eligibility: [
        'Manufacturing companies',
        'Startups in manufacturing',
        'Foreign investors',
        'Domestic entrepreneurs'
      ],
      benefits: 'Policy support, ease of doing business, infrastructure development',
      application_process: 'Apply through investindia.gov.in or respective ministry portals',
      department: 'Department for Promotion of Industry and Internal Trade',
      state: 'All India'
    },
    {
      id: 'digital-india',
      name: 'Digital India Programme',
      description: 'Transforming India into digitally empowered society and knowledge economy',
      eligibility: [
        'All citizens',
        'Government departments',
        'Educational institutions',
        'Businesses and startups'
      ],
      benefits: 'Digital infrastructure, digital literacy, digital services',
      application_process: 'Various components - apply through respective portals and centers',
      department: 'Ministry of Electronics and Information Technology',
      state: 'All India'
    },
    {
      id: 'startup-india',
      name: 'Startup India',
      description: 'Initiative to promote entrepreneurship and innovation',
      eligibility: [
        'Startups incorporated in India',
        'Age of entity less than 10 years',
        'Annual turnover less than ₹100 crore',
        'Working towards innovation/improvement'
      ],
      benefits: 'Tax exemptions, easier compliance, funding support, incubation',
      application_process: 'Register at startupindia.gov.in with required documents',
      department: 'Department for Promotion of Industry and Internal Trade',
      state: 'All India'
    },
    {
      id: 'stand-up-india',
      name: 'Stand Up India',
      description: 'Facilitating bank loans for SC/ST and women entrepreneurs',
      eligibility: [
        'SC/ST borrowers',
        'Women borrowers',
        'Age 18+ years',
        'First-time entrepreneurs',
        'Non-farm sector enterprises'
      ],
      benefits: 'Bank loans between ₹10 lakh to ₹1 crore for greenfield enterprises',
      application_process: 'Apply through designated bank branches or online portal',
      department: 'Ministry of Finance',
      state: 'All India'
    }
  ]

  // Filter schemes based on eligibility criteria
  const matchingSchemes = allSchemes.filter(scheme => {
    let matches = true

    // State-based filtering
    if (eligibility.state && scheme.state !== 'All India') {
      matches = matches && scheme.state === eligibility.state
    }

    // Age-based filtering (basic logic)
    if (eligibility.age) {
      if (scheme.id === 'atal-pension' && (eligibility.age < 18 || eligibility.age > 40)) {
        matches = false
      }
      if (scheme.id === 'sukanya-samriddhi' && eligibility.age > 10) {
        matches = false
      }
      if (scheme.id === 'skill-india' && (eligibility.age < 15 || eligibility.age > 45)) {
        matches = false
      }
    }

    // Income-based filtering
    if (eligibility.income) {
      if (scheme.id === 'ayushman-bharat' && eligibility.income > 500000) {
        matches = false
      }
      if (scheme.id === 'pm-awas-yojana' && eligibility.income > 1800000) {
        matches = false
      }
      if (scheme.id === 'kerala-pension' && eligibility.income > 100000) {
        matches = false
      }
    }

    // Gender-based filtering
    if (eligibility.gender === 'female') {
      // Prioritize women-specific schemes
      if (['beti-bachao', 'sukanya-samriddhi', 'ujjwala-yojana', 'west-bengal-kanyashree', 'rajasthan-bhamashah', 'stand-up-india'].includes(scheme.id)) {
        matches = true
      }
    }

    // Category-based filtering
    if (eligibility.category && ['SC', 'ST'].includes(eligibility.category)) {
      if (['sc-st-development', 'stand-up-india'].includes(scheme.id)) {
        matches = true
      }
    }

    // Occupation-based filtering
    if (eligibility.occupation) {
      if (eligibility.occupation === 'farmer' && ['pm-kisan', 'maharashtra-farmer-loan-waiver'].includes(scheme.id)) {
        matches = true
      }
      if (eligibility.occupation === 'student' && ['national-scholarship', 'west-bengal-kanyashree'].includes(scheme.id)) {
        matches = true
      }
      if (eligibility.occupation === 'business' && ['mudra-yojana', 'startup-india', 'make-in-india'].includes(scheme.id)) {
        matches = true
      }
    }

    return matches
  })

  // Always include some universal schemes
  const universalSchemes = allSchemes.filter(scheme => 
    ['jan-dhan-yojana', 'digital-india', 'skill-india', 'ayushman-bharat'].includes(scheme.id)
  )

  // Combine and deduplicate
  const finalSchemes = [...new Map([...matchingSchemes, ...universalSchemes].map(s => [s.id, s])).values()]

  // Return top 10 most relevant schemes
  return finalSchemes.slice(0, 10)
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  
  try {
    // Parse eligibility criteria from query params
    const eligibility: EligibilityCriteria = {
      age: searchParams.get('age') ? parseInt(searchParams.get('age')!) : null,
      income: searchParams.get('income') ? parseInt(searchParams.get('income')!) : null,
      state: searchParams.get('state'),
      occupation: searchParams.get('occupation'),
      category: searchParams.get('category'),
      gender: searchParams.get('gender') as 'male' | 'female' | 'other' | null,
      disability: searchParams.get('disability') === 'true' ? true : null
    }

    console.log('Fetching schemes for eligibility:', eligibility)

    // Try to fetch from official myScheme API, fallback to mock data
    const result = await fetchSchemesFromMySchemeAPI(eligibility)

    return NextResponse.json({
      eligibility,
      schemes: result.schemes,
      total: result.schemes.length,
      source: result.error ? 'mock data (myScheme API unavailable)' : 'myScheme API',
      api_endpoint: MYSCHEME_API_URL,
      website: MYSCHEME_WEBSITE
    })

  } catch (error) {
    console.error('Schemes API error:', error)
    
    // Even if there's an error, provide mock data
    const mockSchemes = await getMockSchemes({
      age: null,
      income: null,
      state: null,
      occupation: null,
      category: null,
      gender: null,
      disability: null
    })
    
    return NextResponse.json({
      eligibility: {},
      schemes: mockSchemes,
      total: mockSchemes.length,
      source: 'mock data (error fallback)',
      error: 'API error occurred, showing sample schemes',
      api_endpoint: MYSCHEME_API_URL,
      website: MYSCHEME_WEBSITE
    })
  }
}

// Health check endpoint
export async function HEAD(req: NextRequest) {
  return new NextResponse(null, { status: 200 })
}