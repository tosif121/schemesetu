import { NextRequest, NextResponse } from 'next/server'

// Mock database connection - replace with your actual database connection
async function getSchemesFromDatabase(limit: number = 50, offset: number = 0, category?: string) {
  // TODO: Replace with actual database queries
  // Example using your database schema:
  /*
  let query = `
    SELECT 
      s.*,
      COUNT(us.id) as interaction_count,
      COUNT(CASE WHEN us.interaction_type = 'applied' THEN 1 END) as applications
    FROM schemes s
    LEFT JOIN user_schemes us ON s.id = us.scheme_uuid
  `;
  
  const params = [];
  if (category) {
    query += ` WHERE s.category = $${params.length + 1}`;
    params.push(category);
  }
  
  query += ` GROUP BY s.id ORDER BY s.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);
  
  const schemes = await db.query(query, params);
  */
  
  // Mock data based on your schema structure
  const mockSchemes = [
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      scheme_id: 'pm-kisan',
      name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
      description: 'Direct income support scheme for small and marginal farmers providing ₹6000 per year in three equal installments',
      benefits: '₹6000 per year in 3 installments of ₹2000 each directly transferred to bank account',
      eligibility_criteria: {
        occupation: 'farmer',
        landholding: 'up to 2 hectares',
        documents: ['aadhaar', 'bank_account', 'land_records']
      },
      application_url: 'https://pmkisan.gov.in',
      department: 'Ministry of Agriculture and Farmers Welfare',
      state: 'All India',
      category: 'farmer',
      status: 'active',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-15T10:30:00Z',
      interaction_count: 234,
      applications: 89
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      scheme_id: 'ayushman-bharat',
      name: 'Ayushman Bharat PM-JAY',
      description: 'World\'s largest health insurance scheme providing health coverage to economically vulnerable families',
      benefits: '₹5 lakh per family per year health insurance coverage for secondary and tertiary care hospitalization',
      eligibility_criteria: {
        income: 'less than 5 lakh',
        category: ['secc_2011', 'bpl'],
        documents: ['aadhaar', 'family_id']
      },
      application_url: 'https://pmjay.gov.in',
      department: 'Ministry of Health and Family Welfare',
      state: 'All India',
      category: 'health',
      status: 'active',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-14T15:20:00Z',
      interaction_count: 187,
      applications: 76
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      scheme_id: 'national-scholarship',
      name: 'National Scholarship Portal',
      description: 'Umbrella portal for various scholarship schemes for students from different backgrounds',
      benefits: 'Financial assistance for education ranging from ₹1000 to ₹20000 per year depending on the scheme',
      eligibility_criteria: {
        occupation: 'student',
        category: ['sc', 'st', 'obc', 'minority', 'ews'],
        documents: ['aadhaar', 'academic_certificates', 'income_certificate']
      },
      application_url: 'https://scholarships.gov.in',
      department: 'Ministry of Education',
      state: 'All India',
      category: 'student',
      status: 'active',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-13T12:45:00Z',
      interaction_count: 156,
      applications: 67
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      scheme_id: 'mudra-yojana',
      name: 'Pradhan Mantri MUDRA Yojana',
      description: 'Micro-finance scheme providing loans to small businesses and entrepreneurs',
      benefits: 'Collateral-free loans up to ₹10 lakh (Shishu: ₹50k, Kishore: ₹5L, Tarun: ₹10L)',
      eligibility_criteria: {
        occupation: 'business',
        business_type: ['manufacturing', 'trading', 'services'],
        documents: ['aadhaar', 'business_plan', 'bank_account']
      },
      application_url: 'https://mudra.org.in',
      department: 'Ministry of Finance',
      state: 'All India',
      category: 'business',
      status: 'active',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-12T09:15:00Z',
      interaction_count: 134,
      applications: 45
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      scheme_id: 'beti-bachao',
      name: 'Beti Bachao Beti Padhao',
      description: 'Scheme for girl child welfare, education and empowerment',
      benefits: 'Educational support, awareness programs, financial incentives for girl education',
      eligibility_criteria: {
        gender: 'female',
        age: '0-21',
        documents: ['birth_certificate', 'aadhaar']
      },
      application_url: 'https://wcd.nic.in',
      department: 'Ministry of Women and Child Development',
      state: 'All India',
      category: 'women',
      status: 'active',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-11T16:30:00Z',
      interaction_count: 98,
      applications: 34
    }
  ]
  
  // Filter by category if specified
  let filteredSchemes = mockSchemes
  if (category) {
    filteredSchemes = mockSchemes.filter(scheme => scheme.category === category)
  }
  
  return {
    schemes: filteredSchemes.slice(offset, offset + limit),
    total: filteredSchemes.length,
    hasMore: offset + limit < filteredSchemes.length
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const category = searchParams.get('category')
    const status = searchParams.get('status') || 'active'
    
    // Get schemes from database
    const result = await getSchemesFromDatabase(limit, offset, category || undefined)
    
    return NextResponse.json({
      success: true,
      data: {
        schemes: result.schemes,
        total: result.total,
        hasMore: result.hasMore,
        pagination: {
          limit,
          offset,
          category,
          status
        }
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching schemes:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch schemes',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}

// Create new scheme
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // TODO: Validate and insert scheme into database
    // Example:
    /*
    const newScheme = await db.query(`
      INSERT INTO schemes (scheme_id, name, description, benefits, eligibility_criteria, application_url, department, category)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [body.scheme_id, body.name, body.description, body.benefits, body.eligibility_criteria, body.application_url, body.department, body.category]);
    */
    
    return NextResponse.json({
      success: true,
      message: 'Scheme created successfully',
      data: { id: 'mock-id', ...body }
    })
  } catch (error) {
    console.error('Error creating scheme:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create scheme',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}

// Update scheme
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...updateData } = body
    
    // TODO: Update scheme in database
    // Example:
    /*
    const updatedScheme = await db.query(`
      UPDATE schemes 
      SET name = $1, description = $2, benefits = $3, eligibility_criteria = $4, 
          application_url = $5, department = $6, category = $7, updated_at = NOW()
      WHERE id = $8
      RETURNING *
    `, [updateData.name, updateData.description, updateData.benefits, updateData.eligibility_criteria, 
        updateData.application_url, updateData.department, updateData.category, id]);
    */
    
    return NextResponse.json({
      success: true,
      message: 'Scheme updated successfully',
      data: { id, ...updateData }
    })
  } catch (error) {
    console.error('Error updating scheme:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update scheme',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}