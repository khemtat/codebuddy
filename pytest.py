def pyramid(rows):
    for i in range(rows):
        print ' '*(rows-i-1) + '*'*(2*i+1)

#pyramid(8)
#pyramid(6)

pyramid(10)