import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Initial schemes data for seeding the database
const INITIAL_SCHEMES = [
  {
    scheme_id: 'pm-kisan',
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    description: 'Direct income support scheme for small and marginal farmers providing ₹6000 per year in three equal installments',
    benefits: '₹6000 per year in 3 installments of ₹2000 each directly transferred to bank account',
    eligibility_criteria: {
      occupation: ['farmer'],
      landholding: 'up to 2 hectares',
      documents: ['aadhaar', 'bank_account', 'land_records']
    },
    application_url: 'https://pmkisan.gov.in',
    department: 'Ministry of Agriculture and Farmers Welfare',
    state: 'All India',
    category: 'agriculture',
    status: 'active'
  },
  {
    scheme_id: 'ayushman-bharat',
    name: 'Ayushman Bharat PM-JAY',
    description: 'World\'s largest health insurance scheme providing health coverage to economically vulnerable families',
    benefits: '₹5 lakh per family per year health insurance coverage for secondary and tertiary care hospitalization',
    eligibility_criteria: {
      income_max: 500000,
      category: ['secc_2011', 'bpl'],
      documents: ['aadhaar', 'family_id']
    },
    application_url: 'https://pmjay.gov.in',
    department: 'Ministry of Health and Family Welfare',
    state: 'All India',
    category: 'health',
    status: 'active'
  },
  {
    scheme_id: 'mudra-yojana',
    name: 'Pradhan Mantri MUDRA Yojana',
    description: 'Micro-finance scheme providing loans to small businesses and entrepreneurs',
    benefits: 'Collateral-free loans up to ₹10 lakh (Shishu: ₹50k, Kishore: ₹5L, Tarun: ₹10L)',
    eligibility_criteria: {
      occupation: ['business', 'entrepreneur'],
      age_min: 18,
      age_max: 65,
      business_type: ['manufacturing', 'trading', 'services'],
      documents: ['aadhaar', 'business_plan', 'bank_account']
    },
    application_url: 'https://mudra.org.in',
    department: 'Ministry of Finance',
    state: 'All India',
    category: 'business',
    status: 'active'
  },
  {
    scheme_id: 'beti-bachao',
    name: 'Beti Bachao Beti Padhao',
    description: 'Scheme for girl child welfare, education and empowerment',
    benefits: 'Educational support, awareness programs, financial incentives for girl education',
    eligibility_criteria: {
      gender: 'female',
      age_max: 18,
      documents: ['birth_certificate', 'aadhaar']
    },
    application_url: 'https://wcd.nic.in/bbbp-scheme',
    department: 'Ministry of Women and Child Development',
    state: 'All India',
    category: 'women',
    status: 'active'
  },
  {
    scheme_id: 'national-scholarship',
    name: 'National Scholarship Portal',
    description: 'Umbrella portal for various scholarship schemes for students from different backgrounds',
    benefits: 'Financial assistance for education ranging from ₹1000 to ₹20000 per year depending on the scheme',
    eligibility_criteria: {
      occupation: ['student'],
      age_min: 16,
      age_max: 25,
      income_max: 800000,
      category: ['sc', 'st', 'obc', 'minority', 'ews'],
      documents: ['aadhaar', 'academic_certificates', 'income_certificate']
    },
    application_url: 'https://scholarships.gov.in',
    department: 'Ministry of Education',
    state: 'All India',
    category: 'education',
    status: 'active'
  },
  {
    scheme_id: 'pmay-urban',
    name: 'Pradhan Mantri Awas Yojana (Urban)',
    description: 'Housing for all in urban areas',
    benefits: 'Interest subsidy and financial assistance for home purchase',
    eligibility_criteria: {
      income_max: 1800000,
      location_type: 'urban',
      house_ownership: false
    },
    application_url: 'https://pmaymis.gov.in',
    department: 'Ministry of Housing and Urban Affairs',
    state: 'All India',
    category: 'housing',
    status: 'active'
  },
  {
    scheme_id: 'pmay-rural',
    name: 'Pradhan Mantri Awas Yojana (Rural)',
    description: 'Housing for all in rural areas',
    benefits: 'Financial assistance up to ₹1.2 lakh for house construction',
    eligibility_criteria: {
      income_max: 200000,
      location_type: 'rural',
      house_ownership: false
    },
    application_url: 'https://pmayg.nic.in',
    department: 'Ministry of Rural Development',
    state: 'All India',
    category: 'housing',
    status: 'active'
  },
  {
    scheme_id: 'ujjwala',
    name: 'Pradhan Mantri Ujjwala Yojana',
    description: 'Free LPG connections to women from BPL families',
    benefits: 'Free LPG connection and financial assistance',
    eligibility_criteria: {
      gender: 'female',
      category: ['BPL'],
      age_min: 18
    },
    application_url: 'https://pmuy.gov.in',
    department: 'Ministry of Petroleum and Natural Gas',
    state: 'All India',
    category: 'energy',
    status: 'active'
  },
  {
    scheme_id: 'skill-india',
    name: 'Pradhan Mantri Kaushal Vikas Yojana',
    description: 'Skill development and training programs',
    benefits: 'Free skill training and certification',
    eligibility_criteria: {
      age_min: 15,
      age_max: 45,
      education_max: '12th'
    },
    application_url: 'https://pmkvyofficial.org',
    department: 'Ministry of Skill Development and Entrepreneurship',
    state: 'All India',
    category: 'skill',
    status: 'active'
  },
  {
    scheme_id: 'startup-india',
    name: 'Startup India',
    description: 'Support for startups and entrepreneurs',
    benefits: 'Tax benefits, funding support, and mentorship',
    eligibility_criteria: {
      occupation: ['entrepreneur', 'startup'],
      age_min: 18,
      business_age_max: 10
    },
    application_url: 'https://startupindia.gov.in',
    department: 'Department of Industrial Policy and Promotion',
    state: 'All India',
    category: 'business',
    status: 'active'
  }
];

export async function POST(req: NextRequest) {
  try {
    // Check if schemes already exist
    const { count: existingSchemes } = await supabase
      .from('schemes')
      .select('*', { count: 'exact', head: true });

    if (existingSchemes && existingSchemes > 0) {
      return NextResponse.json({
        success: false,
        message: 'Database already contains schemes. Use the admin interface to manage them.',
        existingCount: existingSchemes
      });
    }

    // Insert initial schemes
    const { data: insertedSchemes, error } = await supabase
      .from('schemes')
      .insert(INITIAL_SCHEMES)
      .select();

    if (error) {
      console.error('Error seeding schemes:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${insertedSchemes?.length || 0} schemes into the database`,
      schemes: insertedSchemes
    });

  } catch (error) {
    console.error('Error seeding database:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to seed database',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

// Get seeding status
export async function GET(req: NextRequest) {
  try {
    const { count: schemesCount } = await supabase
      .from('schemes')
      .select('*', { count: 'exact', head: true });

    const { count: usersCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      success: true,
      data: {
        schemes: schemesCount || 0,
        users: usersCount || 0,
        isSeeded: (schemesCount || 0) > 0
      }
    });

  } catch (error) {
    console.error('Error checking seed status:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check seed status',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}