import BarChartBox from '../../components/BarChartBox'
import ContentHeader from '../../components/ContentHeader';
import HistoryBox from '../../components/HistoryBox';
import MessageBox from '../../components/MessageBox';
import PieChartBox from '../../components/PieChartBox';
import SelectInput from '../../components/SelectInput';
import WalletBox from '../../components/WalletBox';
import grinningImg from '../../assets/grinning.svg';
import happyImg from '../../assets/happy.svg';
import listOfMonths from '../../utils/months';
import opsImg from '../../assets/ops.svg';
import sadImg from '../../assets/sad.svg';
import { Container, Content } from './styles';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { Gain } from '../../services/gainService';
import { Expense } from '../../services/expenseService';
import { useGain } from '../../hooks/useGain';
import { useExpense } from '../../hooks/useExpense';

export default function DashboardPage() {
  const { fetchGains } = useGain();
  const { fetchExpenses } = useExpense();
  
  const [monthSelected, setMonthSelected] = useState<number>(new Date().getMonth() + 1);
  const [yearSelected, setYearSelected] = useState<number>(new Date().getFullYear());
  const [gains, setGains] = useState([] as Gain[]);
  const [expenses, setExpenses] = useState([] as Expense[]);

  const years = useMemo(() => {
    let uniqueYears: number[] = [new Date().getFullYear()];

    [...gains, ...expenses].forEach(item => {
      const date = new Date(item.date);
      const year = date.getFullYear();

      if (!uniqueYears.includes(year)) {
        uniqueYears.push(year);
      }
    });

    return uniqueYears.map(year => {
      return {
        value: year,
        label: year,
      };
    });
  }, [gains, expenses]);

  const months = useMemo(() => {
    return listOfMonths.map((month, index) => ({
      value: index + 1,
      label: month,
    }));
  }, []);
  
  const totalExpenses = useMemo(() => {
    let total: number = 0;

    expenses.forEach(item => {
      const date = new Date(item.date);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      if (month === monthSelected && year === yearSelected) {
        try {
          total += Number(item.amount);
        } catch {
          throw new Error('Invalid amount! Amount must be number.');
        }
      }
    });

    return total;
  }, [monthSelected, yearSelected, expenses]);

  const totalGains = useMemo(() => {
    let total: number = 0;

    gains.forEach(item => {
      const date = new Date(item.date);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      if (month === monthSelected && year === yearSelected) {
        try {
          total += Number(item.amount);
        } catch {
          throw new Error('Invalid amount! Amount must be number.');
        }
      }
    });

    return total;
  }, [monthSelected, yearSelected, gains]);

  const totalBalance = useMemo(() => totalGains - totalExpenses, [totalGains, totalExpenses]);

  const message = useMemo(() => {
    if (totalBalance < 0) {
      return {
        title: "Que triste!",
        description: "Neste mês, você gastou mais do que deveria.",
        footerText: "Verifique seus gastos e tente cortar algumas coisas desnecessárias.",
        icon: sadImg
      }
    } else if (totalGains === 0 && totalExpenses === 0) {
      return {
        title: "Op's!",
        description: "Neste mês, não há registros de entradas ou saídas.",
        footerText: "Parece que você não fez nenhum registro no mês e ano selecionado.",
        icon: opsImg
      }
    } else if (totalBalance === 0) {
      return {
        title: "Ufaa!",
        description: "Neste mês, você gastou exatamente o que ganhou.",
        footerText: "Tenha cuidado. No próximo tente poupar o seu dinheiro.",
        icon: grinningImg
      }
    } else {
      return {
        title: "Muito bem!",
        description: "Sua carteira está positiva!",
        footerText: "Continue assim. Considere investir o seu saldo.",
        icon: happyImg
      }
    }
  }, [totalBalance, totalGains, totalExpenses]);

  const relationExpensesVersusGains = useMemo(() => {
    const total = totalGains + totalExpenses;
    const percentGains = Number(((totalGains / total) * 100).toFixed(1));
    const percentExpenses = Number(((totalExpenses / total) * 100).toFixed(1));
    const data = [
      {
        name: "Entradas",
        value: totalGains,
        percent: percentGains ? percentGains : 0, 
        color: '#F7931B'
      },
      {
        name: "Saídas",
        value: totalExpenses,
        percent: percentExpenses ? percentExpenses : 0, 
        color: '#E44C4E'
      },
    ];

    return data;
  }, [totalGains, totalExpenses]);

  const historyData = useMemo(() => {
    return listOfMonths.map((_, month) => {
      let amountEntry = 0;

      gains.forEach(gain => {
        const date = new Date(gain.date);
        const gainMonth = date.getMonth() + 1;
        const gainYear = date.getFullYear();

        if (gainMonth === month && gainYear === yearSelected) {
          try {
            amountEntry += Number(gain.amount);
          } catch {
            throw new Error('amountEntry is invalid. amountEntry must be valid number.');
          }
        }
      });

      let amountOutput = 0;
      expenses.forEach(expense => {
        const date = new Date(expense.date);
        const expenseMonth = date.getMonth() + 1;
        const expenseYear = date.getFullYear();

        if (expenseMonth === month && expenseYear === yearSelected) {
          try {
            amountOutput += Number(expense.amount);
          } catch {
            throw new Error('amountOutput is invalid. amountOutput must be valid number.');
          }
        }
      });

      return {
        monthNumber: month,
        month: listOfMonths[month].substr(0, 3),
        amountEntry,
        amountOutput
      }
    }).filter(item => {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      return (yearSelected === currentYear && item.monthNumber <= currentMonth) || (yearSelected < currentYear)
    });
  }, [yearSelected, gains, expenses]);

  const relationExpenses = useMemo(() => {
    let amountRecurrent = 0;
    let amountEventual = 0;
    let amountEmprestimo = 0;

    expenses.filter((expense) => {
      const date = new Date(expense.date);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      return month === monthSelected && year === yearSelected;
    }).forEach((expense) => {
      if (expense.frequency === 'recorrente') {
        return amountRecurrent += Number(expense.amount);
      }

      if (expense.frequency === 'eventual') {
        return amountEventual += Number(expense.amount);
      }

      if (expense.frequency === 'emprestimo') {
        return amountEmprestimo += Number(expense.amount);
      }
    });

    const total = amountRecurrent + amountEventual + amountEmprestimo;
    const percentRecurrent = Number(((amountRecurrent / total) * 100).toFixed(1));
    const percentEventual = Number(((amountEventual / total) * 100).toFixed(1));
    const percentEmprestimo = Number(((amountEmprestimo / total) * 100).toFixed(1));

    return [
      {
        name: 'Recorrentes',
        amount: amountRecurrent,
        percent: percentRecurrent ? percentRecurrent : 0, 
        color: "#4E41F0"
      },
      {
        name: 'Eventuais',
        amount: amountEventual,
        percent: percentEventual ? percentEventual : 0,
        color: "#E44C4E"
      },
      {
        name: 'Emprestimo',
        amount: amountEmprestimo,
        percent: percentEmprestimo ? percentEmprestimo : 0,
        color: "#F7931B"
      }
    ];
  }, [monthSelected, yearSelected, expenses]);

  const relationGains = useMemo(() => {
    let amountRecurrent = 0;
    let amountEventual = 0;
    let amountEmprestimo = 0;

    gains.filter((gain) => {
      const date = new Date(gain.date);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      return month === monthSelected && year === yearSelected;
    }).forEach((gain) => {
      if (gain.frequency === 'recorrente') {
        return amountRecurrent += Number(gain.amount);
      }

      if (gain.frequency === 'eventual') {
        return amountEventual += Number(gain.amount);
      }

      if (gain.frequency === 'emprestimo') {
        return amountEmprestimo += Number(gain.amount);
      }
    });

    const total = amountRecurrent + amountEventual + amountEmprestimo;
    const percentRecurrent = Number(((amountRecurrent / total) * 100).toFixed(1));
    const percentEventual = Number(((amountEventual / total) * 100).toFixed(1));
    const percentEmprestimo = Number(((amountEmprestimo / total) * 100).toFixed(1));

    return [
      {
        name: 'Recorrentes',
        amount: amountRecurrent,
        percent: percentRecurrent ? percentRecurrent : 0,
        color: "#4E41F0"
      },
      {
        name: 'Eventuais',
        amount: amountEventual,
        percent: percentEventual ? percentEventual : 0,
        color: "#E44C4E"
      },
      {
        name: 'Empréstimos',
        amount: amountEmprestimo,
        percent: percentEmprestimo ? percentEmprestimo : 0,
        color: "#F7931B"
      }
    ];
  }, [monthSelected, yearSelected, gains]);

  const handleMonthSelected = useCallback((month: string) => {
    try {
      const parseMonth = Number(month);
      setMonthSelected(parseMonth);
    } catch {
      throw new Error('Invalid month value. Only accepts 0-24.');
    }
  }, []);

  const handleYearSelected = useCallback((year: string) => {
    try {
      const parseYear = Number(year);
      setYearSelected(parseYear);
    } catch {
      throw new Error('Invalid year value. Only accepts integer numbers.');
    }
  }, []);

  const loadGainsAndExpenses = useCallback(async () => {
    try {
      setGains(await fetchGains());
      setExpenses(await fetchExpenses());
    } catch {
      throw new Error('Something went wrong while fetching the gains and expenses.');
    }
  }, [fetchGains, fetchExpenses]);

  useEffect(() => {
    loadGainsAndExpenses();
  }, [loadGainsAndExpenses]);

  return (
    <Container>
      <ContentHeader title="Painel Principal" lineColor="#F7931B">
        <SelectInput 
          options={months}
          onChange={(e) => handleMonthSelected(e.target.value)} 
          defaultValue={monthSelected}
        />
        
        <SelectInput 
          options={years} 
          onChange={(e) => handleYearSelected(e.target.value)} 
          defaultValue={yearSelected}
        />
      </ContentHeader>

      <Content>
        <WalletBox 
          title="Saldo"
          color="#4E41F0"
          amount={totalBalance}
          footerlabel="Atualizado com base nas entradas e saídas"
          icon="dolar"
        />

        <WalletBox 
          title="Entradas"
          color="#F7931B"
          amount={totalGains}
          footerlabel="Atualizado com base nas entradas e saídas"
          icon="arrowUp"
        />

        <WalletBox 
          title="Saídas"
          color="#E44C4E"
          amount={totalExpenses}
          footerlabel="Atualizado com base nas entradas e saídas"
          icon="arrowDown"
        />

        <MessageBox
          title={message.title}
          description={message.description}
          footerText={message.footerText}
          icon={message.icon}
        />

        <PieChartBox data={relationExpensesVersusGains} />

        <HistoryBox 
          data={historyData} 
          lineColorAmountEntry="#F7931B"
          lineColorAmountOutput="#E44C4E"
        />

        <BarChartBox 
          title="Saídas"
          data={relationExpenses} 
        />
        
        <BarChartBox 
          title="Entradas"
          data={relationGains} 
        />
      </Content>
    </Container>
  );
};