const API_URL = 'https://qa-needhou.herokuapp.com/api/';
//const API_URL = 'http://localhost:8000/api/';

const USER_ACTIONS = {
    ADD: 'ADD',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
}

const ACTION_CLASS = {
    DELETED: 'DELETED',
    CHANGED: 'CHANGED',
}

const ACTION_MESSAGE = {
    DELETED: '(deleted)'
}

const AGE_GROUPS = [
  'adult (approximately 19-64yrs)',
  'early childhood (approximately 0-4yrs)',
  'kids (approximately 5-12yrs)',
  'seniors (approximately 65+yrs)',
  'youth (approximately 13-18yrs)',
];

const USA_STATES = [
  {
      "name": "Alabama",
      "abbreviation": "AL"
  },
  {
      "name": "Alaska",
      "abbreviation": "AK"
  },
  {
      "name": "American Samoa",
      "abbreviation": "AS"
  },
  {
      "name": "Arizona",
      "abbreviation": "AZ"
  },
  {
      "name": "Arkansas",
      "abbreviation": "AR"
  },
  {
      "name": "California",
      "abbreviation": "CA"
  },
  {
      "name": "Colorado",
      "abbreviation": "CO"
  },
  {
      "name": "Connecticut",
      "abbreviation": "CT"
  },
  {
      "name": "Delaware",
      "abbreviation": "DE"
  },
  {
      "name": "District Of Columbia",
      "abbreviation": "DC"
  },
  {
      "name": "Federated States Of Micronesia",
      "abbreviation": "FM"
  },
  {
      "name": "Florida",
      "abbreviation": "FL"
  },
  {
      "name": "Georgia",
      "abbreviation": "GA"
  },
  {
      "name": "Guam",
      "abbreviation": "GU"
  },
  {
      "name": "Hawaii",
      "abbreviation": "HI"
  },
  {
      "name": "Idaho",
      "abbreviation": "ID"
  },
  {
      "name": "Illinois",
      "abbreviation": "IL"
  },
  {
      "name": "Indiana",
      "abbreviation": "IN"
  },
  {
      "name": "Iowa",
      "abbreviation": "IA"
  },
  {
      "name": "Kansas",
      "abbreviation": "KS"
  },
  {
      "name": "Kentucky",
      "abbreviation": "KY"
  },
  {
      "name": "Louisiana",
      "abbreviation": "LA"
  },
  {
      "name": "Maine",
      "abbreviation": "ME"
  },
  {
      "name": "Marshall Islands",
      "abbreviation": "MH"
  },
  {
      "name": "Maryland",
      "abbreviation": "MD"
  },
  {
      "name": "Massachusetts",
      "abbreviation": "MA"
  },
  {
      "name": "Michigan",
      "abbreviation": "MI"
  },
  {
      "name": "Minnesota",
      "abbreviation": "MN"
  },
  {
      "name": "Mississippi",
      "abbreviation": "MS"
  },
  {
      "name": "Missouri",
      "abbreviation": "MO"
  },
  {
      "name": "Montana",
      "abbreviation": "MT"
  },
  {
      "name": "Nebraska",
      "abbreviation": "NE"
  },
  {
      "name": "Nevada",
      "abbreviation": "NV"
  },
  {
      "name": "New Hampshire",
      "abbreviation": "NH"
  },
  {
      "name": "New Jersey",
      "abbreviation": "NJ"
  },
  {
      "name": "New Mexico",
      "abbreviation": "NM"
  },
  {
      "name": "New York",
      "abbreviation": "NY"
  },
  {
      "name": "North Carolina",
      "abbreviation": "NC"
  },
  {
      "name": "North Dakota",
      "abbreviation": "ND"
  },
  {
      "name": "Northern Mariana Islands",
      "abbreviation": "MP"
  },
  {
      "name": "Ohio",
      "abbreviation": "OH"
  },
  {
      "name": "Oklahoma",
      "abbreviation": "OK"
  },
  {
      "name": "Oregon",
      "abbreviation": "OR"
  },
  {
      "name": "Palau",
      "abbreviation": "PW"
  },
  {
      "name": "Pennsylvania",
      "abbreviation": "PA"
  },
  {
      "name": "Puerto Rico",
      "abbreviation": "PR"
  },
  {
      "name": "Rhode Island",
      "abbreviation": "RI"
  },
  {
      "name": "South Carolina",
      "abbreviation": "SC"
  },
  {
      "name": "South Dakota",
      "abbreviation": "SD"
  },
  {
      "name": "Tennessee",
      "abbreviation": "TN"
  },
  {
      "name": "Texas",
      "abbreviation": "TX"
  },
  {
      "name": "Utah",
      "abbreviation": "UT"
  },
  {
      "name": "Vermont",
      "abbreviation": "VT"
  },
  {
      "name": "Virgin Islands",
      "abbreviation": "VI"
  },
  {
      "name": "Virginia",
      "abbreviation": "VA"
  },
  {
      "name": "Washington",
      "abbreviation": "WA"
  },
  {
      "name": "West Virginia",
      "abbreviation": "WV"
  },
  {
      "name": "Wisconsin",
      "abbreviation": "WI"
  },
  {
      "name": "Wyoming",
      "abbreviation": "WY"
  }
];

const IMMIGRATION_STATUSES = [
  'Immigrant Visa',
  'Legal Permanent Resident',
  'Non-immigrant Visa',
  'Status in process',
  'Temporary Work permit',
  'U.S Citizen',
  'Undocumented'
];

const IDS = [
  'Alternative evidence',
  'Any government-issued non-photo document',
  'Any photo ID',
  'Foreign-goverment-issued ID',
  'Visas'
];

const PROOF_OF_ADDRESS = [
  'No, not required',
  'Yes, such as lease, bill, bank statement, or other documents displaying name and address',
  'Yes, verification letter from referring agency',
  'Yes, verification letter from person providing housing'
];

const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

const DEFAULT_WEEKDAYS_TIME = {
    'Monday-from': '9:00 AM',
    'Monday-to': '5:00 PM',
    'Tuesday-from': '9:00 AM',
    'Tuesday-to': '5:00 PM',
    'Wednesday-from': '9:00 AM',
    'Wednesday-to': '5:00 PM',
    'Thursday-from': '9:00 AM',
    'Thursday-to': '5:00 PM',
    'Friday-from': '9:00 AM',
    'Friday-to': '5:00 PM',
};

const HOURS = [
    '12:00 AM',
    '1:00 AM',
    '2:00 AM',
    '3:00 AM',
    '4:00 AM',
    '5:00 AM',
    '6:00 AM',
    '7:00 AM',
    '8:00 AM',
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM',
    '6:00 PM',
    '7:00 PM',
    '8:00 PM',
    '9:00 PM',
    '10:00 PM',
    '11:00 PM',
];

const AVAILABLE_INTERPRETATION = [
  'No, not available',
  'No, not required',
  'Yes, for billing staff',
  'Yes, for frontline staff',
  'Yes, for program staff'
];

const STAFF_CULTURAL_TRAINING = [
  'Yes, required for client-facing staff',
  'Yes, optional for client-facing staff',
  'No, but we are interested in a cultural competency training',
  'No, we are not interested in a training'
];

const YES_NO_OPTIONS = [
    {
        value: 'yes',
        label: 'Yes'
    },
    {
        value: 'no',
        label: 'No'
    }
];

const PROGRAM_SERVICES = [
    {
        value: 'legal',
        label: 'Legal',
        description: 'May include immigration, domestic violence, family law, criminal law, wills, guardianship, and others.'
    },
    {
        value: 'health',
        label: 'Health',
        description: 'May include medical services ranging from health screening to treatment for chronic illnesses. Also includes dental and mental health services.'
    },
    {
        value: 'education',
        label: 'Education',
        description: 'May include classes in literacy, GED, financial literacy, legal education, anger management, bullying, parenting, health and sexuality. Skills development like gardening or computers. After school youth programs. Also includes access to supplies through opportunities like back to school drives.'
    },
    {
        value: 'employment',
        label:'Employment',
        description: 'May include assistance for adults and youth in direct job placement, job searches, resume writing, job readiness training, specialized training/certification with the goal of employment and entrepreneurship.'
    },
    {
        value: 'food',
        label: 'Food',
        description: 'May include direct food donations, brown bag programs, food pantries, holiday meals, kids’ meals and programs, and access to baby food and formula. Also includes education through classes, events, and community gardens.'
    },
    {
        value: 'housing',
        label: 'Housing',
        description: 'May include assistance finding affordable, transitional, temporary and emergency housing, including foster care. Residential treatment programs and domestic violence shelters. Access to rental, utility and other housing-related assistance.'
    },
    {
        value: 'money',
        label: 'Financial Assistance',
        description: 'May include financial counseling and literacy. Access to rental, utility and other housing-related assistance; clothing, personal care items, and non-prescription medications.'
    },
    {
        value: 'family',
        label: 'Additional Support',
        description: 'Includes a wide-range of programs to support families including childcare, eldercare, crisis intervention, disaster assistance, and family enrichment activities.'
    },
];

const INCOME_POVERTY_LEVEL_PERCENTS = [
    {
        value: 20,
        label: '< 20%'
    },
    {
        value: 40,
        label: '< 40%'
    },
    { 
        value: 60,
        label: '< 60%'
    },
    { 
        value: 80,
        label: '< 80%'
    },
    { 
        value: 100,
        label: '< 100%'
    },
    { 
        value: 120,
        label: '< 120%'
    },
    { 
        value: 140,
        label: '< 140%'
    },
    {
        value: 160,
        label: '< 160%'
    },
    {
        value: 180,
        label: '< 180%'
    },
    {
        value: 200,
        label: '< 200%'
    }
];

const CRISIS = [
    'No',
    'Yes, 24 hour',
    'Yes, during service hours',
]

const LANGUAGES = [
    {
        value: 'multi-lingual -- call to inquire',
        label: 'Multi-lingual -- call to inquire'
    },
    {
        value: 'english',
        label: 'English'
    },
    {
        value: 'spanish',
        label: 'Spanish or Spanish Creole'
    },
    {
        value: 'vietnamese',
        label: 'Vietnamese'
    },
    {
        value: 'chinese',
        label: 'Chinese'
    },
    {
        value: 'arabic',
        label: 'Arabic'
    },
    {
        value: 'cambodian',
        label: 'Cambodian'
    },
    {
        value: 'french',
        label: 'French'
    },
    {
        value: 'french creole',
        label: 'French Creole'
    },
    {
        value: 'german',
        label: 'German'
    },
    {
        value: 'greek',
        label: 'Greek'
    },
    {
        value: 'gujarati',
        label: 'Gujarati'
    },
    {
        value: 'hebrew',
        label: 'Hebrew'
    },
    {
        value: 'hindi',
        label: 'Hindi'
    },
    {
        value: 'hungarian',
        label: 'Hungarian'
    },
    {
        value: 'italian',
        label: 'Italian'
    },
    {
        value: 'japanese',
        label: 'Japanese'
    },
    {
        value: 'korean',
        label: 'Korean'
    },
    {
        value: 'monkhmer',
        label: 'Mon-Khmer'
    },
    {
        value: 'persian',
        label: 'Persian'
    },
    {
        value: 'polish',
        label: 'Polish'
    },
    {
        value: 'portuguese',
        label: 'Portuguese'
    },
    {
        value: 'russian',
        label: 'Russian'
    },
    {
        value: 'serbo-croatian',
        label: 'Serbo-Croatian'
    },
    {
        value: 'tagalog',
        label: 'Tagalog'
    },
    {
        value: 'thai',
        label: 'Thai'
    },
    {
        value: 'urdu',
        label: 'Urdu'
    }
]

export {
  API_URL,
  USER_ACTIONS,
  ACTION_CLASS,
  ACTION_MESSAGE,
  LANGUAGES,
  AGE_GROUPS,
  USA_STATES,
  IMMIGRATION_STATUSES,
  IDS,
  PROOF_OF_ADDRESS,
  WEEKDAYS,
  DEFAULT_WEEKDAYS_TIME,
  HOURS,
  AVAILABLE_INTERPRETATION,
  STAFF_CULTURAL_TRAINING,
  YES_NO_OPTIONS,
  INCOME_POVERTY_LEVEL_PERCENTS,
  CRISIS,
  PROGRAM_SERVICES,
}
