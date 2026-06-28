import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Modal from '../components/Modal';
import Paginacao from '../components/Paginacao';

const FORM_INICIAL = {
  apiaryName: '',
  city: '',
  registrationNumber: '',
  territoryRegistration: '',
  description: '',
  latitude: '',
  longitude: '',
};

export default function Apiarios() {
  const [apiarios, setApiarios] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [form, setForm] = useState(FORM_INICIAL);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [confirmandoDeletar, setConfirmandoDeletar] = useState(null);
  const navigate = useNavigate();

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const dados = await api.apiarios.listar(pagina);
      setApiarios(dados.content || []);
      setTotalPaginas(dados.totalPages || 0);
    } catch {
      setErro('Erro ao carregar apiários.');
    } finally {
      setCarregando(false);
    }
  }, [pagina]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSalvar(e) {
    e.preventDefault();
    setSalvando(true);
    try {
      await api.apiarios.criar({
        ...form,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
      });
      setModalAberto(false);
      setForm(FORM_INICIAL);
      setPagina(0);
      carregar();
    } catch (err) {
      alert('Erro ao salvar: ' + err.message);
    } finally {
      setSalvando(false);
    }
  }

  async function handleDeletar(id) {
    try {
      await api.apiarios.deletar(id);
      setConfirmandoDeletar(null);
      carregar();
    } catch {
      alert('Erro ao deletar o apiário.');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Meus Apiários</h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie seus apiários cadastrados</p>
        </div>
        <button
          onClick={() => setModalAberto(true)}
          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2 rounded-lg transition flex items-center gap-2"
        >
          <span className="text-lg">+</span> Novo Apiário
        </button>
      </div>

      {erro && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
          {erro}
        </div>
      )}

      {carregando ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
        </div>
      ) : apiarios.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <span className="text-5xl block mb-3">🏡</span>
          <p className="font-medium">Nenhum apiário cadastrado ainda</p>
          <p className="text-sm mt-1">Clique em "Novo Apiário" para começar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {apiarios.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition cursor-pointer"
              onClick={() => navigate(`/apiarios/${a.id}/colmeias`, { state: { nome: a.apiaryName } })}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-gray-800 text-base truncate">{a.apiaryName}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">{a.city}</p>
                </div>
                <span className="text-2xl ml-2">🐝</span>
              </div>

              <div className="mt-3 space-y-1">
                <p className="text-xs text-gray-400">
                  <span className="font-medium text-gray-600">Registro:</span> {a.registrationNumber}
                </p>
                <p className="text-xs text-gray-400">
                  <span className="font-medium text-gray-600">Território:</span> {a.territoryRegistration}
                </p>
                {a.description && (
                  <p className="text-xs text-gray-400 line-clamp-2 mt-2">{a.description}</p>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-amber-600 font-medium">Ver colmeias →</span>
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmandoDeletar(a); }}
                  className="text-xs text-red-400 hover:text-red-600 transition font-medium"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Paginacao pagina={pagina} totalPaginas={totalPaginas} onMudar={setPagina} />

      {modalAberto && (
        <Modal titulo="Novo Apiário" onFechar={() => { setModalAberto(false); setForm(FORM_INICIAL); }}>
          <form onSubmit={handleSalvar} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nome do Apiário *</label>
                <input
                  name="apiaryName"
                  value={form.apiaryName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Cidade *</label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nº de Registro *</label>
                <input
                  name="registrationNumber"
                  value={form.registrationNumber}
                  onChange={handleChange}
                  required
                  placeholder="API-2026-001"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Registro Territorial *</label>
                <input
                  name="territoryRegistration"
                  value={form.territoryRegistration}
                  onChange={handleChange}
                  required
                  placeholder="TR-458721"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Latitude *</label>
                <input
                  name="latitude"
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={handleChange}
                  required
                  placeholder="-24.9558"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Longitude *</label>
                <input
                  name="longitude"
                  type="number"
                  step="any"
                  value={form.longitude}
                  onChange={handleChange}
                  required
                  placeholder="-53.4552"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Informações adicionais sobre o apiário..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setModalAberto(false); setForm(FORM_INICIAL); }}
                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={salvando}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg text-sm font-semibold transition disabled:opacity-60"
              >
                {salvando ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {confirmandoDeletar && (
        <Modal titulo="Confirmar Exclusão" onFechar={() => setConfirmandoDeletar(null)}>
          <p className="text-gray-600 text-sm mb-4">
            Tem certeza que deseja excluir o apiário <strong>{confirmandoDeletar.apiaryName}</strong>?
            Todas as colmeias vinculadas também serão removidas.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setConfirmandoDeletar(null)}
              className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              onClick={() => handleDeletar(confirmandoDeletar.id)}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-semibold transition"
            >
              Excluir
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
