// useSessionStats.js

/**
 * Hook para calcular as métricas de dashboard a partir de uma lista de sessões.
 * @param {Array<Object>} sessions Lista de objetos de sessão (deve ser filtrada para o usuário correto no componente pai).
 * @returns {Object} Um objeto com as estatísticas calculadas (stats).
 */
const useSessionStats = (sessions) => {
    // CRÍTICO: Filtra apenas as sessões CONCLUÍDAS (com fimSessao)
    const completedSessions = sessions.filter(s => s.fimSessao);

    if (completedSessions.length === 0) {
        return {
            totalHours: 0,
            avgFatigue: 0,
            totalBreaks: 0,
            productivityScore: 0,
            sessionsThisWeek: 0,
            // ... outras métricas
        };
    }

    // Processamento de Datas (Filtro Semanal e Pausas)
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Mapeia e filtra os dados para facilitar os cálculos
    const statsData = completedSessions.map(session => {
        // Conversão segura de minutos para horas (para horas trabalhadas)
        const durationMin = session.duracaoMinutos || 0;
        
        return {
            durationMin: durationMin,
            pausaMin: session.pausaMinutos || 0,
            cansaco: session.nivelCansaco || 0,
            fimSessao: new Date(session.fimSessao.replace(/\[UTC\]$/, '')), // Limpeza da string Oracle
            inicioSessao: new Date(session.inicioSessao.replace(/\[UTC\]$/, '')),
        };
    });
    
    // Filtra sessões da última semana
    const sessionsThisWeek = statsData.filter(s => s.inicioSessao >= oneWeekAgo);

    // Soma das métricas
    const totalDurationMin = sessionsThisWeek.reduce((sum, s) => sum + s.durationMin, 0);
    const totalBreaksMin = sessionsThisWeek.reduce((sum, s) => sum + s.pausaMin, 0);
    const totalFatigueScore = sessionsThisWeek.reduce((sum, s) => sum + s.cansaco, 0);
    
    // Cálculos Finais
    const totalHours = Math.round(totalDurationMin / 60);
    const avgFatigue = Math.round(totalFatigueScore / sessionsThisWeek.length);
    const totalBreaks = totalBreaksMin;
    
    // Jargão Técnico (Produtividade Score - Simulação):
    // Produtividade é inversamente proporcional ao cansaço e diretamente proporcional ao tempo trabalhado.
    // Usamos uma heurística simples: (Horas * 10) - (Cansaço Médio * 5)
    // Garantir que o score esteja entre 0 e 100.
    let rawProductivityScore = (totalDurationMin / 60) * 10 - (avgFatigue * 5);
    const productivityScore = Math.min(100, Math.max(0, Math.round(rawProductivityScore)));


    return {
        totalHours: totalHours,
        avgFatigue: avgFatigue,
        totalBreaks: totalBreaks,
        productivityScore: productivityScore,
        sessionsThisWeek: sessionsThisWeek.length,
        // Adicione mais métricas conforme necessário...
    };
};

export default useSessionStats;