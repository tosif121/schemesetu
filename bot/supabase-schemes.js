// Supabase scheme functions for the bot
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Get all schemes from Supabase
async function getAllSchemes() {
  try {
    const { data: schemes, error } = await supabase
      .from('schemes')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching schemes from Supabase:', error);
      throw error;
    }

    // Transform Supabase data to match bot format
    return schemes.map(scheme => ({
      id: scheme.scheme_id,
      name: scheme.name,
      description: scheme.description,
      benefits: scheme.benefits,
      eligibility: scheme.eligibility_criteria || {},
      url: scheme.application_url,
      department: scheme.department,
      category: scheme.category
    }));
  } catch (error) {
    console.error('Error in getAllSchemes:', error);
    throw error;
  }
}

// Get schemes by category from Supabase
async function getSchemesByCategory(category) {
  try {
    const { data: schemes, error } = await supabase
      .from('schemes')
      .select('*')
      .eq('status', 'active')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching schemes by category from Supabase:', error);
      throw error;
    }

    // Transform Supabase data to match bot format
    return schemes.map(scheme => ({
      id: scheme.scheme_id,
      name: scheme.name,
      description: scheme.description,
      benefits: scheme.benefits,
      eligibility: scheme.eligibility_criteria || {},
      url: scheme.application_url,
      department: scheme.department,
      category: scheme.category
    }));
  } catch (error) {
    console.error('Error in getSchemesByCategory:', error);
    throw error;
  }
}

// Filter schemes based on eligibility (works with Supabase data)
async function filterSchemes(eligibility) {
  try {
    // Get all schemes from Supabase
    const allSchemes = await getAllSchemes();
    
    return allSchemes.filter(scheme => {
      // Check occupation match (strict)
      if (eligibility.occupation && scheme.eligibility.occupation) {
        const userOccupation = eligibility.occupation.toLowerCase();
        const schemeOccupations = Array.isArray(scheme.eligibility.occupation) 
          ? scheme.eligibility.occupation.map(occ => occ.toLowerCase())
          : [scheme.eligibility.occupation.toLowerCase()];
        
        const occupationMatch = schemeOccupations.some(occ => 
          userOccupation.includes(occ) || occ.includes(userOccupation)
        );
        
        if (!occupationMatch) {
          return false; // Exclude if occupation doesn't match
        }
      }

      // Check income eligibility (strict - must be within limit)
      if (eligibility.income && scheme.eligibility.income_max) {
        if (eligibility.income > scheme.eligibility.income_max) {
          return false; // Exclude if income exceeds limit
        }
      }

      // Check age eligibility (strict - must be within range)
      if (eligibility.age && (scheme.eligibility.age_min || scheme.eligibility.age_max)) {
        const ageMatch = (!scheme.eligibility.age_min || eligibility.age >= scheme.eligibility.age_min) &&
                        (!scheme.eligibility.age_max || eligibility.age <= scheme.eligibility.age_max);
        if (!ageMatch) {
          return false; // Exclude if age is outside range
        }
      }

      // Check gender eligibility (strict)
      if (eligibility.gender && scheme.eligibility.gender) {
        if (eligibility.gender !== scheme.eligibility.gender) {
          return false; // Exclude if gender doesn't match
        }
      }

      // Check category eligibility (strict)
      if (eligibility.category && scheme.eligibility.category) {
        const schemeCategories = Array.isArray(scheme.eligibility.category) 
          ? scheme.eligibility.category 
          : [scheme.eligibility.category];
        if (!schemeCategories.includes(eligibility.category)) {
          return false; // Exclude if category doesn't match
        }
      }

      // If no specific user criteria provided, show popular schemes
      const hasUserData = eligibility.age || eligibility.occupation || eligibility.income || eligibility.gender || eligibility.category;
      if (!hasUserData) {
        return ['pm-kisan', 'ayushman-bharat', 'mudra-yojana'].includes(scheme.id);
      }

      return true; // Include if all checks passed
    });
  } catch (error) {
    console.error('Error in filterSchemes:', error);
    throw error;
  }
}

// Get schemes by occupation from Supabase
async function getSchemesByOccupation(occupation) {
  try {
    const allSchemes = await getAllSchemes();
    
    return allSchemes.filter(scheme => {
      if (!scheme.eligibility.occupation) return false;
      
      const schemeOccupations = Array.isArray(scheme.eligibility.occupation) 
        ? scheme.eligibility.occupation.map(occ => occ.toLowerCase())
        : [scheme.eligibility.occupation.toLowerCase()];
      
      return schemeOccupations.some(occ => 
        occ.includes(occupation.toLowerCase()) || occupation.toLowerCase().includes(occ)
      );
    });
  } catch (error) {
    console.error('Error in getSchemesByOccupation:', error);
    throw error;
  }
}

// Get schemes by gender from Supabase
async function getSchemesByGender(gender) {
  try {
    const allSchemes = await getAllSchemes();
    
    return allSchemes.filter(scheme => {
      return scheme.eligibility.gender === gender;
    });
  } catch (error) {
    console.error('Error in getSchemesByGender:', error);
    throw error;
  }
}

// Log scheme interaction to Supabase
async function logSchemeInteraction(userId, schemeId, interactionType, platform) {
  try {
    // First get the scheme UUID from scheme_id
    const { data: scheme, error: schemeError } = await supabase
      .from('schemes')
      .select('id')
      .eq('scheme_id', schemeId)
      .single();

    if (schemeError || !scheme) {
      console.error('Error finding scheme:', schemeError);
      return;
    }

    // Log the interaction
    const { error } = await supabase
      .from('user_schemes')
      .insert({
        user_id: userId,
        scheme_uuid: scheme.id,
        scheme_id: schemeId,
        interaction_type: interactionType,
        status: 'pending'
      });

    if (error) {
      console.error('Error logging scheme interaction:', error);
    }

    // Also log to analytics
    await supabase
      .from('analytics')
      .insert({
        user_id: userId,
        platform: platform,
        event_type: 'scheme_interaction',
        event_data: {
          scheme_id: schemeId,
          interaction_type: interactionType
        }
      });

  } catch (error) {
    console.error('Error in logSchemeInteraction:', error);
  }
}

// Log conversation to Supabase
async function logConversation(userId, platform, messageType, content, metadata = {}) {
  try {
    const { error } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        platform: platform,
        message_type: messageType,
        content: content,
        metadata: metadata
      });

    if (error) {
      console.error('Error logging conversation:', error);
    }
  } catch (error) {
    console.error('Error in logConversation:', error);
  }
}

module.exports = {
  getAllSchemes,
  getSchemesByCategory,
  filterSchemes,
  getSchemesByOccupation,
  getSchemesByGender,
  logSchemeInteraction,
  logConversation
};