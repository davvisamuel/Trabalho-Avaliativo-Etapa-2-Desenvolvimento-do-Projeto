export default function Paginacao({ pagina, totalPaginas, onMudar }) {
  if (totalPaginas <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onMudar(pagina - 1)}
        disabled={pagina === 0}
        className="px-3 py-1 rounded border border-gray-300 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Anterior
      </button>

      {Array.from({ length: totalPaginas }, (_, i) => (
        <button
          key={i}
          onClick={() => onMudar(i)}
          className={`px-3 py-1 rounded border text-sm ${
            i === pagina
              ? 'bg-amber-500 border-amber-500 text-white font-medium'
              : 'border-gray-300 text-gray-600 hover:bg-gray-100'
          }`}
        >
          {i + 1}
        </button>
      ))}

      <button
        onClick={() => onMudar(pagina + 1)}
        disabled={pagina === totalPaginas - 1}
        className="px-3 py-1 rounded border border-gray-300 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Próxima
      </button>
    </div>
  );
}
