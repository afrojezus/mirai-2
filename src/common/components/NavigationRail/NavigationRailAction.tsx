// Based on https://codesandbox.io/s/navigation-rail-demo-ub1s9?file=%2FNavigationRailAction.tsx%3A759-1134
import './styles.scss';
import { BottomNavigationActionProps, BottomNavigationAction } from "@mui/material";



const NavigationRailAction: React.FC<BottomNavigationActionProps & { visible: boolean; }> = ({ visible = true, ...props }) => {
    return (
        <BottomNavigationAction
            {...props}
            sx={(theme) => ({
                transition: theme.transitions.create(['all']),
                ...(visible ? { opacity: 1, pointerEvents: undefined } : { opacity: 0, pointerEvents: 'none' })
            })}
            classes={{
                root: 'root',
                iconOnly: 'iconOnly',
                label: 'label',
                selected: 'selected'
            }}
        />
    );
};

export default NavigationRailAction;