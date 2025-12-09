// Format currency
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount || 0);
};

// Format weight
export const formatWeight = (weight) => {
    return `${parseFloat(weight || 0).toFixed(2)} kg`;
};

// Format date
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

// Format datetime
export const formatDateTime = (date) => {
    return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

// Preset lobster categories
export const PRESET_CATEGORIES = [
    {
        name: 'Panulirus Homarus (Brown/Sand) 200-300g',
        species: 'Panulirus Homarus',
        weightRange: '200-300g'
    },
    {
        name: 'Panulirus Homarus (Brown/Sand) 300-500g',
        species: 'Panulirus Homarus',
        weightRange: '300-500g'
    },
    {
        name: 'Panulirus Homarus (Brown/Sand) 500-1200g',
        species: 'Panulirus Homarus',
        weightRange: '500-1200g'
    },
    {
        name: 'Panulirus Peniciliatus (Rock) 200-300g',
        species: 'Panulirus Peniciliatus',
        weightRange: '200-300g'
    },
    {
        name: 'Panulirus Peniciliatus (Rock) 300-500g',
        species: 'Panulirus Peniciliatus',
        weightRange: '300-500g'
    },
    {
        name: 'Panulirus Peniciliatus (Rock) 500-1200g',
        species: 'Panulirus Peniciliatus',
        weightRange: '500-1200g'
    },
    {
        name: 'Panulirus Versicolor (Bamboo) 200-300g',
        species: 'Panulirus Versicolor',
        weightRange: '200-300g'
    },
    {
        name: 'Panulirus Versicolor (Bamboo) 300-500g',
        species: 'Panulirus Versicolor',
        weightRange: '300-500g'
    },
    {
        name: 'Panulirus Versicolor (Bamboo) 500-1200g',
        species: 'Panulirus Versicolor',
        weightRange: '500-1200g'
    }
];
