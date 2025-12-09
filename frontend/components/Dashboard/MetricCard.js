'use client';

const MetricCard = ({ title, value, subtitle, icon: Icon, color = 'ocean' }) => {
    const colorClasses = {
        ocean: 'bg-ocean-500 text-white',
        green: 'bg-green-500 text-white',
        red: 'bg-red-500 text-white',
        blue: 'bg-blue-500 text-white',
    };

    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                    {subtitle && (
                        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                    )}
                </div>
                {Icon && (
                    <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                        <Icon size={24} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MetricCard;
