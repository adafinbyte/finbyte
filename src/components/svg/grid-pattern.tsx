import { FinbyteContext } from "@/contexts"
import { FC, HTMLAttributes, useContext } from "react"

interface custom_props extends HTMLAttributes<SVGElement> {}
const GridPatternSvg: FC <custom_props> = ({
  ...props
}) => {
  const { theme } = useContext(FinbyteContext);
  const stroke_map = {
    Neutral: '#262626',
    Slate: '#1e293b'
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={`${props.className}`} width="757" height="840" viewBox="0 0 757 840" fill="none">
    <mask id="mask0_941_706" style={{ maskType: 'alpha'}} maskUnits="userSpaceOnUse" x="0" y="0" width="757" height="840">
    <rect width="757" height="840" fill="#18181B"/>
    </mask>
    <g mask="url(#mask0_941_706)">
    <line x1="-278.327" y1="780.287" x2="35.1432" y2="1323.23" stroke={`${stroke_map[theme]}`}/>
    <line x1="-277.925" y1="107.279" x2="35.5452" y2="650.225" stroke={`${stroke_map[theme]}`}/>
    <line x1="-236.29" y1="83.2419" x2="77.1801" y2="626.188" stroke={`${stroke_map[theme]}`}/>
    <line x1="-194.659" y1="59.2068" x2="118.811" y2="602.153" stroke={`${stroke_map[theme]}`}/>
    <line x1="-284.448" y1="770.52" x2="132.314" y2="529.903" stroke={`${stroke_map[theme]}`}/>
    <line x1="-316.717" y1="714.629" x2="100.044" y2="474.011" stroke={`${stroke_map[theme]}`}/>
    <line x1="-348.987" y1="658.737" x2="67.775" y2="418.119" stroke={`${stroke_map[theme]}`}/>
    <line x1="-381.256" y1="602.845" x2="35.5057" y2="362.228" stroke={`${stroke_map[theme]}`}/>
    <line x1="-413.523" y1="546.954" x2="3.23847" y2="306.337" stroke={`${stroke_map[theme]}`}/>
    <line x1="-236.401" y1="756.08" x2="77.0687" y2="1299.03" stroke={`${stroke_map[theme]}`}/>
    <line x1="-194.766" y1="732.042" x2="118.704" y2="1274.99" stroke={`${stroke_map[theme]}`}/>
    <line x1="-153.138" y1="708.007" x2="160.332" y2="1250.95" stroke={`${stroke_map[theme]}`}/>
    <line x1="-111.501" y1="683.969" x2="201.969" y2="1226.91" stroke={`${stroke_map[theme]}`}/>
    <line x1="-69.8681" y1="659.931" x2="243.602" y2="1202.88" stroke={`${stroke_map[theme]}`}/>
    <line x1="-28.2372" y1="635.896" x2="285.233" y2="1178.84" stroke={`${stroke_map[theme]}`}/>
    <line x1="13.3956" y1="611.859" x2="326.866" y2="1154.8" stroke={`${stroke_map[theme]}`}/>
    <line x1="55.0304" y1="587.821" x2="368.5" y2="1130.77" stroke={`${stroke_map[theme]}`}/>
    <line x1="96.6613" y1="563.786" x2="410.131" y2="1106.73" stroke={`${stroke_map[theme]}`}/>
    <line x1="-122.203" y1="1051.53" x2="294.559" y2="810.915" stroke={`${stroke_map[theme]}`}/>
    <line x1="-154.472" y1="995.641" x2="262.289" y2="755.024" stroke={`${stroke_map[theme]}`}/>
    <line x1="-186.742" y1="939.75" x2="230.02" y2="699.133" stroke={`${stroke_map[theme]}`}/>
    <line x1="-219.011" y1="883.859" x2="197.751" y2="643.241" stroke={`${stroke_map[theme]}`}/>
    <line x1="-251.281" y1="827.967" x2="165.481" y2="587.349" stroke={`${stroke_map[theme]}`}/>
    <line x1="-152.731" y1="35.0007" x2="160.739" y2="577.947" stroke={`${stroke_map[theme]}`}/>
    <line x1="-111.096" y1="10.9634" x2="202.374" y2="553.909" stroke={`${stroke_map[theme]}`}/>
    <line x1="-69.4673" y1="-13.0718" x2="244.003" y2="529.874" stroke={`${stroke_map[theme]}`}/>
    <line x1="-27.8305" y1="-37.1104" x2="285.639" y2="505.836" stroke={`${stroke_map[theme]}`}/>
    <line x1="13.8022" y1="-61.1479" x2="327.272" y2="481.798" stroke={`${stroke_map[theme]}`}/>
    <line x1="55.4332" y1="-85.1826" x2="368.903" y2="457.763" stroke={`${stroke_map[theme]}`}/>
    <line x1="97.0659" y1="-109.22" x2="410.536" y2="433.726" stroke={`${stroke_map[theme]}`}/>
    <line x1="138.701" y1="-133.257" x2="452.171" y2="409.689" stroke={`${stroke_map[theme]}`}/>
    <line x1="180.332" y1="-157.292" x2="493.802" y2="385.653" stroke={`${stroke_map[theme]}`}/>
    <line x1="90.5424" y1="554.02" x2="507.304" y2="313.403" stroke={`${stroke_map[theme]}`}/>
    <line x1="58.2731" y1="498.129" x2="475.035" y2="257.511" stroke={`${stroke_map[theme]}`}/>
    <line x1="26.0037" y1="442.237" x2="442.766" y2="201.619" stroke={`${stroke_map[theme]}`}/>
    <line x1="-6.26562" y1="386.345" x2="410.496" y2="145.728" stroke={`${stroke_map[theme]}`}/>
    <line x1="-38.5329" y1="330.454" x2="378.229" y2="89.8366" stroke={`${stroke_map[theme]}`}/>
    <line x1="-70.8022" y1="274.563" x2="345.96" y2="33.945" stroke={`${stroke_map[theme]}`}/>
    <line x1="-103.072" y1="218.671" x2="313.69" y2="-21.9463" stroke={`${stroke_map[theme]}`}/>
    <line x1="-135.341" y1="162.78" x2="281.421" y2="-77.8379" stroke={`${stroke_map[theme]}`}/>
    <line x1="-167.61" y1="106.888" x2="249.152" y2="-133.73" stroke={`${stroke_map[theme]}`}/>
    <line x1="138.589" y1="539.579" x2="452.059" y2="1082.53" stroke={`${stroke_map[theme]}`}/>
    <line x1="180.224" y1="515.542" x2="493.694" y2="1058.49" stroke={`${stroke_map[theme]}`}/>
    <line x1="221.853" y1="491.507" x2="535.323" y2="1034.45" stroke={`${stroke_map[theme]}`}/>
    <line x1="263.49" y1="467.468" x2="576.96" y2="1010.41" stroke={`${stroke_map[theme]}`}/>
    <line x1="305.122" y1="443.43" x2="618.592" y2="986.376" stroke={`${stroke_map[theme]}`}/>
    <line x1="346.753" y1="419.396" x2="660.223" y2="962.341" stroke={`${stroke_map[theme]}`}/>
    <line x1="388.386" y1="395.358" x2="701.856" y2="938.304" stroke={`${stroke_map[theme]}`}/>
    <line x1="430.021" y1="371.321" x2="743.491" y2="914.267" stroke={`${stroke_map[theme]}`}/>
    <line x1="471.652" y1="347.286" x2="785.122" y2="890.232" stroke={`${stroke_map[theme]}`}/>
    <line x1="381.863" y1="1058.6" x2="798.625" y2="817.982" stroke={`${stroke_map[theme]}`}/>
    <line x1="349.593" y1="1002.71" x2="766.355" y2="762.09" stroke={`${stroke_map[theme]}`}/>
    <line x1="317.324" y1="946.816" x2="734.086" y2="706.198" stroke={`${stroke_map[theme]}`}/>
    <line x1="285.055" y1="890.924" x2="701.817" y2="650.307" stroke={`${stroke_map[theme]}`}/>
    <line x1="252.788" y1="835.033" x2="669.549" y2="594.416" stroke={`${stroke_map[theme]}`}/>
    <line x1="220.518" y1="779.142" x2="637.28" y2="538.524" stroke={`${stroke_map[theme]}`}/>
    <line x1="188.249" y1="723.25" x2="605.011" y2="482.633" stroke={`${stroke_map[theme]}`}/>
    <line x1="155.98" y1="667.359" x2="572.741" y2="426.741" stroke={`${stroke_map[theme]}`}/>
    <line x1="123.71" y1="611.467" x2="540.472" y2="370.849" stroke={`${stroke_map[theme]}`}/>
    <line x1="222.257" y1="-181.5" x2="535.727" y2="361.446" stroke={`${stroke_map[theme]}`}/>
    <line x1="263.892" y1="-205.537" x2="577.362" y2="337.409" stroke={`${stroke_map[theme]}`}/>
    <line x1="305.521" y1="-229.572" x2="618.991" y2="313.374" stroke={`${stroke_map[theme]}`}/>
    <line x1="347.158" y1="-253.611" x2="660.628" y2="289.335" stroke={`${stroke_map[theme]}`}/>
    <line x1="388.79" y1="-277.648" x2="702.26" y2="265.298" stroke={`${stroke_map[theme]}`}/>
    <line x1="430.421" y1="-301.683" x2="743.891" y2="241.263" stroke={`${stroke_map[theme]}`}/>
    <line x1="472.054" y1="-325.72" x2="785.524" y2="217.225" stroke={`${stroke_map[theme]}`}/>
    <line x1="513.689" y1="-349.758" x2="827.159" y2="193.188" stroke={`${stroke_map[theme]}`}/>
    <line x1="555.32" y1="-373.793" x2="868.79" y2="169.153" stroke={`${stroke_map[theme]}`}/>
    <line x1="465.531" y1="337.52" x2="882.292" y2="96.9023" stroke={`${stroke_map[theme]}`}/>
    <line x1="433.261" y1="281.629" x2="850.023" y2="41.0109" stroke={`${stroke_map[theme]}`}/>
    <line x1="400.992" y1="225.736" x2="817.754" y2="-14.8811" stroke={`${stroke_map[theme]}`}/>
    <line x1="368.723" y1="169.845" x2="785.484" y2="-70.7725" stroke={`${stroke_map[theme]}`}/>
    <line x1="336.455" y1="113.954" x2="753.217" y2="-126.664" stroke={`${stroke_map[theme]}`}/>
    <line x1="304.186" y1="58.0623" x2="720.948" y2="-182.555" stroke={`${stroke_map[theme]}`}/>
    <line x1="271.917" y1="2.17075" x2="688.678" y2="-238.447" stroke={`${stroke_map[theme]}`}/>
    <line x1="513.577" y1="323.08" x2="827.047" y2="866.026" stroke={`${stroke_map[theme]}`}/>
    <line x1="555.212" y1="299.042" x2="868.682" y2="841.988" stroke={`${stroke_map[theme]}`}/>
    <line x1="596.841" y1="275.008" x2="910.311" y2="817.954" stroke={`${stroke_map[theme]}`}/>
    <line x1="638.478" y1="250.969" x2="951.948" y2="793.915" stroke={`${stroke_map[theme]}`}/>
    <line x1="680.111" y1="226.931" x2="993.581" y2="769.877" stroke={`${stroke_map[theme]}`}/>
    <line x1="721.742" y1="202.896" x2="1035.21" y2="745.842" stroke={`${stroke_map[theme]}`}/>
    <line x1="756.851" y1="842.099" x2="1173.61" y2="601.482" stroke={`${stroke_map[theme]}`}/>
    <line x1="724.582" y1="786.208" x2="1141.34" y2="545.591" stroke={`${stroke_map[theme]}`}/>
    <line x1="692.312" y1="730.316" x2="1109.07" y2="489.698" stroke={`${stroke_map[theme]}`}/>
    <line x1="660.043" y1="674.425" x2="1076.8" y2="433.807" stroke={`${stroke_map[theme]}`}/>
    <line x1="627.776" y1="618.534" x2="1044.54" y2="377.916" stroke={`${stroke_map[theme]}`}/>
    <line x1="595.506" y1="562.642" x2="1012.27" y2="322.024" stroke={`${stroke_map[theme]}`}/>
    <line x1="563.237" y1="506.751" x2="979.999" y2="266.133" stroke={`${stroke_map[theme]}`}/>
    <line x1="530.968" y1="450.859" x2="947.729" y2="210.242" stroke={`${stroke_map[theme]}`}/>
    <line x1="498.698" y1="394.967" x2="915.46" y2="154.35" stroke={`${stroke_map[theme]}`}/>
    </g>
    </svg>
  )
}

export default GridPatternSvg;