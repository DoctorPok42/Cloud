import styles from './style.module.scss';

interface SidebarProps {
    title: string;
}

const Sidebar = ({title}: SidebarProps) => {
    return (
        <div className={styles.bandeau}>
            <img src="/favicon.ico" alt="logo" />
            <h2>{title}</h2>
        </div>
    )
}

export default Sidebar