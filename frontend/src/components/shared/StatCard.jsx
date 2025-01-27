export default function StatCard({ title, value, icon }) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{icon}</span>
            </div>
            <h3 className="text-gray-500 text-sm">{title}</h3>
            <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
    );
} 