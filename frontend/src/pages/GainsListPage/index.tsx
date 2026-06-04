import Button from '../../components/Button';
import ContentHeader from '../../components/ContentHeader';
import HistoryFinanceCard from '../../components/HistoryFinanceCard';
import SelectInput from '../../components/SelectInput';
import formatCurrency from '../../core/utils/formatCurrency';
import formatDate from '../../core/utils/formatDate';
import listOfMonths from '../../core/utils/months';
import useAPI from '../../data/hooks/useAPI';
import { Container, Content, Filters } from './styles';
import { GainsList } from '../../core/types/gains-list.type';
import { Link } from 'react-router-dom';
import { useMemo, useState, useEffect, useCallback } from 'react';

interface IData {
    id: number;
    description: string;
    amountFormatted: string;
    frequency: string;
    dateFormatted: string;
    tagColor: string;
}

export default function GainsListPage() {
    const { api } = useAPI();

    const [data, setData] = useState<IData[]>([]);
    const [monthSelected, setMonthSelected] = useState<number>(new Date().getMonth() + 1);
    const [yearSelected, setYearSelected] = useState<number>(new Date().getFullYear());
    const [frequencyFilterSelected, setFrequencyFilterSelected] = useState(['recorrente', 'eventual', 'emprestimo']);
    const [gains, setGains] = useState([] as GainsList);

    const pageData = useMemo(() => ({
        title: 'Entradas',
        lineColor: '#4E41F0',
        data: gains
    }), [gains]);

    const years = useMemo(() => {
        let uniqueYears: number[] = [new Date().getFullYear()];

        const { data } = pageData;

        data.forEach(item => {
            const date = new Date(item.date);
            const year = date.getFullYear();

            if(!uniqueYears.includes(year)) {
                uniqueYears.push(year)
            }
        });

        return uniqueYears.map(year => ({
            value: year,
            label: year,
        }));
    }, [pageData]);

    const months = useMemo(() => listOfMonths.map((month, index) => ({
        value: index + 1,
        label: month,
    })), []);

    const handleFrequencyClick = (frequency: string) => {
        const alreadySelected = frequencyFilterSelected.findIndex(item => item === frequency);
        if(alreadySelected >= 0){
            const filtered = frequencyFilterSelected.filter(item => item !== frequency);
            setFrequencyFilterSelected(filtered);
        } else {
            setFrequencyFilterSelected((prev) => [...prev, frequency]); 
        }
    }

    const handleMonthSelected = (month: string) => {
        try {
            const parseMonth = Number(month);
            setMonthSelected(parseMonth);
        } catch {
            throw new Error('invalid month value. Only accepts 0-24.');
        }
    }

    const handleYearSelected = (year: string) => {
        try {
            const parseYear = Number(year);
            setYearSelected(parseYear);
        } catch {
            throw new Error('invalid year value. Only accepts integer numbers.');
        }
    }

    const loadGains = useCallback(async () => {
        try {
            setGains(await api.gains.list());
        } catch {
            throw new Error('Something went wrong while fetching the gains.');
        }
    }, [api.gains]);

    useEffect(() => {        
        const { data } = pageData;

        const filteredData = data.filter(item => {
            const date = new Date(item.date);
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            return month === monthSelected && year === yearSelected && frequencyFilterSelected.includes(item.frequency);
        });

        const formattedData = filteredData.map(item => ({
            id: item.id,
            description: item.description,
            amountFormatted: formatCurrency(Number(item.amount)),
            frequency: item.frequency,
            dateFormatted: formatDate(item.date),
            tagColor: item.frequency === 'recorrente' ? '#4E41F0' : (
                item.frequency === 'eventual' ? '#E44C4E' : '#F7931B'
            ),
        }));
        
        setData(formattedData);
    }, [pageData, monthSelected, yearSelected, data.length, frequencyFilterSelected]);

    useEffect(() => {
        loadGains();
    }, [loadGains]);

    return (
        <Container>
            <ContentHeader title={pageData.title} lineColor={pageData.lineColor}>
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

            <Link to="/gains/create">
                <Button type="button">
                    Adicionar Entrada
                </Button>
            </Link>

            <Filters>
                <button 
                    type="button"
                    className={`
                        tag-filter 
                        tag-filter-recurrent
                        ${frequencyFilterSelected.includes('recorrente') && 'tag-actived'}
                    `}
                    onClick={() => handleFrequencyClick('recorrente')}
                >
                    Recorrentes
                </button>

                <button 
                    type="button"
                    className={`
                        tag-filter 
                        tag-filter-eventual
                        ${frequencyFilterSelected.includes('eventual') && 'tag-actived'}
                    `}
                    onClick={() => handleFrequencyClick('eventual')}
                >
                    Eventuais
                </button>

                <button 
                    type="button"
                    className={`
                        tag-filter 
                        tag-filter-emprestimo
                        ${frequencyFilterSelected.includes('emprestimo') && 'tag-actived'}
                    `}
                    onClick={() => handleFrequencyClick('emprestimo')}
                >
                    Empréstimos
                </button>
            </Filters>

            <Content>
                {data.map(item => (
                    <HistoryFinanceCard 
                        key={item.id}
                        tagColor={item.tagColor}
                        title={item.description}
                        subtitle={item.dateFormatted}
                        amount={item.amountFormatted}
                        updateLink={`/gains/${item.id}`}
                    />
                ))}     
            </Content>            
        </Container>
    );
}